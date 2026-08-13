import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // Added ChangeDetectorRef
import { CommonModule } from '@angular/common';
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

  newIntern: any = { firstName: '', lastName: '', email: '', designation: 'Frontend Developer', department: '', status: 'Active' };
  selectedIntern: any = null;
  isEditMode = false;

  constructor(
    private internService: InternService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef // Injected ChangeDetectorRef to force UI updates
  ) { }

  ngOnInit() {
    this.loadInterns();
  }

  loadInterns() {
    this.internService.getAllInterns().subscribe({
      next: (data) => {
        this.internsList = data;
        // Forces Angular to update the HTML table immediately!
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.toastr.error('Failed to load interns data', 'Error');
        console.error(err);
      }
    });
  }

  // --- Add Modal Logic ---
  openAddModal() {
    this.newIntern = { firstName: '', lastName: '', email: '', designation: 'Frontend Developer', department: '', status: 'Active' };
    this.isAddModalOpen = true;
  }

  closeAddModal() {
    this.isAddModalOpen = false;
    this.cdr.detectChanges(); // Force UI update
  }

  saveNewIntern() {
    this.internService.addIntern(this.newIntern).subscribe({
      next: (res) => {
        this.isAddModalOpen = false; // Close the modal
        this.toastr.success('New intern added successfully', 'Success');
        this.loadInterns(); // Refresh the table
        this.cdr.detectChanges(); // Force Angular to apply these changes immediately!
      },
      error: (err) => {
        this.toastr.error('Failed to add intern', 'Error');
        console.error(err);
      }
    });
  }

  // --- View/Edit Modal Logic ---
  openViewModal(intern: any) {
    this.selectedIntern = { ...intern };
    this.isEditMode = false;
    this.isViewModalOpen = true;
  }

  closeViewModal() {
    this.isViewModalOpen = false;
    this.selectedIntern = null;
    this.cdr.detectChanges(); // Force UI update
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }

  saveUpdatedIntern() {
    this.internService.updateIntern(this.selectedIntern.id, this.selectedIntern).subscribe({
      next: (res) => {
        this.isEditMode = false;
        this.isViewModalOpen = false; // Close the modal
        this.toastr.success('Intern details updated successfully', 'Success');
        this.loadInterns(); // Refresh the table
        this.cdr.detectChanges(); // Force Angular to apply these changes immediately!
      },
      error: (err) => {
        this.toastr.error('Failed to update intern', 'Error');
        console.error(err);
      }
    });
  }

  getStatusClass(status: string): string {
    return status?.toLowerCase() === 'active' ? 'badge-active' : 'badge-inactive';
  }
}