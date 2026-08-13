import { Component, OnInit, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../components/sidebar/sidebar';
import { ProjectService } from '../../services/project';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './projects.html',
  styleUrl: './projects.css'
})
export class Projects implements OnInit {
  isSidebarCollapsed = false;
  projectsList: any[] = [];

  searchTerm: string = '';
  currentFilter: string = 'All';

  isModalOpen = false;
  isEditMode = false;
  currentProject: any = this.getEmptyProject();

  // Temporary strings to handle form inputs before converting to Arrays
  techStackInput: string = '';
  teamMembersInput: string = '';

  constructor(
    private projectService: ProjectService,
    private toastr: ToastrService,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadProjects();
    }
  }

  // Updated to match your exact Spring Boot Model
  getEmptyProject() {
    return { name: '', description: '', techStack: [], teamMemberIds: [], deadline: '', progressPercentage: 0, status: 'ACTIVE' };
  }

  loadProjects() {
    this.projectService.getAllProjects().subscribe({
      next: (data) => {
        this.ngZone.run(() => {
          this.projectsList = data;
        });
      },
      error: (err) => console.error('Error loading projects', err)
    });
  }

  get filteredProjects() {
    return this.projectsList.filter(proj => {
      const titleMatch = proj.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) || false;
      const filterMatch = this.currentFilter === 'All' || proj.status?.toUpperCase() === this.currentFilter.toUpperCase();
      return titleMatch && filterMatch;
    });
  }

  setFilter(filter: string) {
    this.currentFilter = filter;
  }

  // --- Modal Logic ---
  openAddModal() {
    this.ngZone.run(() => {
      this.isEditMode = false;
      this.currentProject = this.getEmptyProject();
      this.techStackInput = '';
      this.teamMembersInput = '';
      this.isModalOpen = true;
    });
  }

  openEditModal(project: any) {
    this.ngZone.run(() => {
      this.isEditMode = true;
      this.currentProject = { ...project };
      // Convert arrays back to comma-separated strings for the form
      this.techStackInput = project.techStack ? project.techStack.join(', ') : '';
      this.teamMembersInput = project.teamMemberIds ? project.teamMemberIds.join(', ') : '';
      this.isModalOpen = true;
    });
  }

  closeModal() {
    this.ngZone.run(() => this.isModalOpen = false);
  }

  saveProject() {
    if (!this.currentProject.name || !this.currentProject.deadline) {
      this.toastr.warning('Name and Deadline are required!', 'Validation Error');
      return;
    }

    // Convert comma-separated string inputs into proper Arrays for the Database!
    this.currentProject.techStack = this.techStackInput.split(',').map(s => s.trim()).filter(s => s !== '');
    this.currentProject.teamMemberIds = this.teamMembersInput.split(',').map(s => s.trim()).filter(s => s !== '');

    if (this.isEditMode) {
      this.projectService.updateProject(this.currentProject.id, this.currentProject).subscribe({
        next: () => {
          this.ngZone.run(() => {
            this.isModalOpen = false;
            this.toastr.success('Project updated successfully', 'Success');
            this.loadProjects();
          });
        },
        error: () => this.ngZone.run(() => this.toastr.error('Update failed', 'Error'))
      });
    } else {
      this.projectService.addProject(this.currentProject).subscribe({
        next: () => {
          this.ngZone.run(() => {
            this.isModalOpen = false;
            this.toastr.success('Project created successfully', 'Success');
            this.loadProjects();
          });
        },
        error: () => this.ngZone.run(() => this.toastr.error('Creation failed', 'Error'))
      });
    }
  }

  getStatusClass(status: string): string {
    const s = status?.toLowerCase();
    if (s === 'active') return 'badge-active';
    if (s === 'done' || s === 'completed') return 'badge-done';
    if (s === 'due' || s === 'archived') return 'badge-due';
    return 'badge-active';
  }
}