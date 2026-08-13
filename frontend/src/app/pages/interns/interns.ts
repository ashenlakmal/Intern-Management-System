import { Component, OnInit } from '@angular/core';
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

  // Modal states
  isAddModalOpen = false;
  isViewModalOpen = false;

  // Form objects
  // Updated object with 'designation' instead of 'role'
  newIntern: any = { firstName: '', lastName: '', email: '', designation: 'Frontend Developer', department: '', status: 'Active' };
  selectedIntern: any = null;
  isEditMode = false;

  constructor(
    private internService: InternService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.loadInterns();
  }

  // Fetches real data from the database
  loadInterns() {
    this.internService.getAllInterns().subscribe({
      next: (data) => this.internsList = data,
      error: (err) => this.toastr.error('Failed to load interns data', 'Error')
    });
  }

  // Add Modal logic
  openAddModal() {
    this.newIntern = { firstName: '', lastName: '', email: '', designation: 'Frontend Developer', department: '', status: 'Active' };
    this.isAddModalOpen = true;
  }

  closeAddModal() {
    this.isAddModalOpen = false;
  }

  saveNewIntern() {
    this.internService.addIntern(this.newIntern).subscribe({
      next: (res) => {
        // setTimeout ensures Angular updates the UI state immediately
        setTimeout(() => {
          this.isAddModalOpen = false;
          this.loadInterns();
          this.toastr.success('New intern added successfully', 'Success');
        });
      },
      error: (err) => this.toastr.error('Failed to add intern', 'Error')
    });
  }

  // View/Edit Modal logic
  openViewModal(intern: any) {
    this.selectedIntern = { ...intern }; // Create a copy to avoid immediate mutation
    this.isEditMode = false;
    this.isViewModalOpen = true;
  }

  closeViewModal() {
    this.isViewModalOpen = false;
    this.selectedIntern = null;
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }

  saveUpdatedIntern() {
    this.internService.updateIntern(this.selectedIntern.id, this.selectedIntern).subscribe({
      next: (res) => {
        setTimeout(() => {
          this.isEditMode = false;
          this.isViewModalOpen = false;
          this.loadInterns();
          this.toastr.success('Intern details updated successfully', 'Success');
        });
      },
      error: (err) => this.toastr.error('Failed to update intern', 'Error')
    });
  }

  // Helper for UI badges
  getStatusClass(status: string): string {
    return status?.toLowerCase() === 'active' ? 'badge-active' : 'badge-inactive';
  }
}