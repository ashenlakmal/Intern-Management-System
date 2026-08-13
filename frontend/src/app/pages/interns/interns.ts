import { Component, OnInit, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../components/sidebar/sidebar';
import { InternService } from '../../services/intern';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-interns',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './interns.html',
  styleUrl: './interns.css'
})
export class Interns implements OnInit {
  isSidebarCollapsed = false;
  internsList: any[] = [];

  isAddModalOpen = false;
  isViewModalOpen = false;
  searchTerm: string = '';

  newIntern: any = { firstName: '', lastName: '', email: '', designation: 'Frontend Developer', department: '', status: 'Active' };
  selectedIntern: any = null;
  isEditMode = false;

  constructor(
    private internService: InternService,
    private toastr: ToastrService,
    private ngZone: NgZone, // Using NgZone instead of ChangeDetector (Fixes the double-click bug)
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  // Dynamically filters the interns list based on the search term
  get filteredInterns() {
    if (!this.searchTerm) {
      return this.internsList;
    }

    const lowerCaseSearch = this.searchTerm.toLowerCase();

    return this.internsList.filter(intern => {
      const fullName = `${intern.firstName} ${intern.lastName}`.toLowerCase();
      const email = intern.email.toLowerCase();

      return fullName.includes(lowerCaseSearch) || email.includes(lowerCaseSearch);
    });
  }

  ngOnInit() {
    // Only fetch data if it's running in the real browser (Fixes the empty table on refresh bug!)
    if (isPlatformBrowser(this.platformId)) {
      this.loadInterns();
    }
  }

  loadInterns() {
    this.internService.getAllInterns().subscribe({
      next: (data) => {
        this.ngZone.run(() => {
          this.internsList = data.filter((user: any) => user.role === 'INTERN');
        });
      },
      error: (err) => console.error('Error loading interns', err)
    });
  }

  // --- Add Modal Logic ---
  openAddModal() {
    this.ngZone.run(() => {
      this.newIntern = { firstName: '', lastName: '', email: '', designation: 'Frontend Developer', department: '', status: 'Active' };
      this.isAddModalOpen = true;
    });
  }

  closeAddModal() {
    this.ngZone.run(() => {
      this.isAddModalOpen = false;
    });
  }

  saveNewIntern() {
    // 1. FORM VALIDATION: Check for empty fields
    if (!this.newIntern.firstName || !this.newIntern.lastName || !this.newIntern.email) {
      this.toastr.warning('Please fill all required fields before saving!', 'Validation Error');
      return;
    }

    // 2. EMAIL VALIDATION: Check valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.newIntern.email)) {
      this.toastr.warning('Please enter a valid email address!', 'Invalid Email');
      return;
    }

    // 3. DUPLICATE CHECK: Check if email already exists in our table
    const emailExists = this.internsList.some(intern => intern.email.toLowerCase() === this.newIntern.email.toLowerCase());
    if (emailExists) {
      this.toastr.error('This email is already registered in the system!', 'Duplicate Intern');
      return;
    }

    // Force Role
    this.newIntern.role = 'INTERN';

    // API Call
    this.internService.addIntern(this.newIntern).subscribe({
      next: (res) => {
        // ngZone strictly enforces UI updates on the VERY FIRST CLICK
        this.ngZone.run(() => {
          this.isAddModalOpen = false;
          this.toastr.success('New intern added successfully', 'Success');
          this.loadInterns();
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          this.toastr.error('Failed to add intern', 'Error');
        });
      }
    });
  }

  // --- View/Edit Modal Logic ---
  openViewModal(intern: any) {
    this.ngZone.run(() => {
      this.selectedIntern = { ...intern };
      this.isEditMode = false;
      this.isViewModalOpen = true;
    });
  }

  closeViewModal() {
    this.ngZone.run(() => {
      this.isViewModalOpen = false;
      this.selectedIntern = null;
    });
  }

  toggleEditMode() {
    this.ngZone.run(() => {
      this.isEditMode = !this.isEditMode;
    });
  }

  saveUpdatedIntern() {
    // VALIDATION FOR EDIT MODE
    if (!this.selectedIntern.firstName || !this.selectedIntern.lastName || !this.selectedIntern.email) {
      this.toastr.warning('Fields cannot be empty!', 'Validation Error');
      return;
    }

    this.internService.updateIntern(this.selectedIntern.id, this.selectedIntern).subscribe({
      next: (res) => {
        this.ngZone.run(() => {
          this.isEditMode = false;
          this.isViewModalOpen = false; // Closes instantly!
          this.toastr.success('Intern details updated successfully', 'Success');
          this.loadInterns();
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          this.toastr.error('Failed to update intern', 'Error');
        });
      }
    });
  }

  getStatusClass(status: string): string {
    return status?.toLowerCase() === 'active' ? 'badge-active' : 'badge-inactive';
  }
}