import { Component, OnInit, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../components/sidebar/sidebar';
import { ProjectService } from '../../services/project';
import { InternService } from '../../services/intern'; // Added InternService!
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
  allInterns: any[] = []; // Store all interns from database

  searchTerm: string = '';
  currentFilter: string = 'All';

  isModalOpen = false;
  isEditMode = false;
  currentProject: any = this.getEmptyProject();

  techStackInput: string = '';

  // Custom Dropdown States
  internSearchTerm: string = '';
  showInternDropdown: boolean = false;

  constructor(
    private projectService: ProjectService,
    private internService: InternService, // Injected InternService
    private toastr: ToastrService,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadProjects();
      this.loadInterns(); // Fetch interns when page loads
    }
  }

  getEmptyProject() {
    return { name: '', description: '', techStack: [], teamMemberIds: [], deadline: '', progressPercentage: 0, status: 'ACTIVE' };
  }

  loadProjects() {
    this.projectService.getAllProjects().subscribe({
      next: (data) => this.ngZone.run(() => this.projectsList = data),
      error: (err) => console.error('Error loading projects', err)
    });
  }

  loadInterns() {
    this.internService.getAllInterns().subscribe({
      next: (data) => {
        this.ngZone.run(() => {
          // Only get users who are Interns
          this.allInterns = data.filter((u: any) => u.role === 'INTERN');
        });
      }
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

  // --- ADVANCED TEAM MEMBER SELECTION LOGIC ---

  // Get interns that match search and are NOT already selected
  get availableInterns() {
    let available = this.allInterns.filter(i => !this.currentProject.teamMemberIds.includes(i.id));

    if (this.internSearchTerm) {
      const term = this.internSearchTerm.toLowerCase();
      available = available.filter(i =>
        (i.firstName + ' ' + i.lastName).toLowerCase().includes(term) ||
        i.email.toLowerCase().includes(term)
      );
    }
    return available;
  }

  addTeamMember(intern: any) {
    this.ngZone.run(() => {
      if (!this.currentProject.teamMemberIds) this.currentProject.teamMemberIds = [];
      this.currentProject.teamMemberIds.push(intern.id);
      this.internSearchTerm = ''; // Clear search after adding
      this.showInternDropdown = false; // Hide dropdown
    });
  }

  removeTeamMember(id: any) {
    this.ngZone.run(() => {
      this.currentProject.teamMemberIds = this.currentProject.teamMemberIds.filter((i: any) => i !== id);
    });
  }

  // Delay hiding dropdown so click events on items can register first
  hideDropdownWithDelay() {
    setTimeout(() => {
      this.ngZone.run(() => this.showInternDropdown = false);
    }, 200);
  }

  // Get full intern details using ID (used for UI display)
  getInternDetails(id: any) {
    return this.allInterns.find(i => i.id === id);
  }

  // --- Modal Logic ---
  openAddModal() {
    this.ngZone.run(() => {
      this.isEditMode = false;
      this.currentProject = this.getEmptyProject();
      this.techStackInput = '';
      this.internSearchTerm = '';
      this.isModalOpen = true;
    });
  }

  openEditModal(project: any) {
    this.ngZone.run(() => {
      this.isEditMode = true;
      this.currentProject = { ...project };
      if (!this.currentProject.teamMemberIds) this.currentProject.teamMemberIds = [];
      this.techStackInput = project.techStack ? project.techStack.join(', ') : '';
      this.internSearchTerm = '';
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

    this.currentProject.techStack = this.techStackInput.split(',').map(s => s.trim()).filter(s => s !== '');

    const apiCall = this.isEditMode ?
      this.projectService.updateProject(this.currentProject.id, this.currentProject) :
      this.projectService.addProject(this.currentProject);

    apiCall.subscribe({
      next: () => {
        this.ngZone.run(() => {
          this.isModalOpen = false;
          this.toastr.success(`Project ${this.isEditMode ? 'updated' : 'created'} successfully`, 'Success');
          this.loadProjects();
        });
      },
      error: () => this.ngZone.run(() => this.toastr.error('Operation failed', 'Error'))
    });
  }
  getStatusClass(status: string): string {
    const s = status?.toLowerCase();
    if (s === 'active') return 'badge-active';
    if (s === 'done' || s === 'completed') return 'badge-done';
    if (s === 'due' || s === 'archived') return 'badge-due';
    return 'badge-active';
  }
}