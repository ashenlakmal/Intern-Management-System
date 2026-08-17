import { Component, OnInit, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../components/sidebar/sidebar';
import { TaskService } from '../../services/task';
import { ProjectService } from '../../services/project';
import { InternService } from '../../services/intern';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css'
})
export class Tasks implements OnInit {
  isSidebarCollapsed = false;

  tasksList: any[] = [];
  projectsList: any[] = [];
  internsList: any[] = [];

  searchTerm: string = '';

  isModalOpen = false;
  isEditMode = false;
  currentTask: any = this.getEmptyTask();

  constructor(
    private taskService: TaskService,
    private projectService: ProjectService,
    private internService: InternService,
    private toastr: ToastrService,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadAllData();
    }
  }

  getEmptyTask() {
    return { title: '', description: '', projectId: '', assigneeId: '', priority: 'MEDIUM', status: 'TO_DO', dueDate: '' };
  }

  loadAllData() {
    this.internService.getAllInterns().subscribe(data => {
      this.ngZone.run(() => this.internsList = data.filter((u: any) => u.role === 'INTERN'));
    });

    this.projectService.getAllProjects().subscribe(data => {
      this.ngZone.run(() => this.projectsList = data);
    });

    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getAllTasks().subscribe({
      next: (data) => this.ngZone.run(() => this.tasksList = data),
      error: (err) => console.error('Error loading tasks', err)
    });
  }

  get filteredTasks() {
    if (!this.searchTerm) return this.tasksList;
    const term = this.searchTerm.toLowerCase();
    return this.tasksList.filter(t => t.title?.toLowerCase().includes(term));
  }

  // Group tasks for Kanban Board
  getTasksByStatus(status: string) {
    return this.filteredTasks.filter(t => t.status === status);
  }

  // Mappers for UI display
  getProjectName(projectId: string): string {
    const proj = this.projectsList.find(p => p.id === projectId);
    return proj ? proj.name : 'No Project';
  }

  getAssignee(assigneeId: string): any {
    return this.internsList.find(i => i.id === assigneeId) || null;
  }

  // Modal Actions
  openAddModal(defaultStatus: string = 'TO_DO') {
    this.ngZone.run(() => {
      this.isEditMode = false;
      this.currentTask = this.getEmptyTask();
      this.currentTask.status = defaultStatus;
      this.isModalOpen = true;
    });
  }

  openEditModal(task: any) {
    this.ngZone.run(() => {
      this.isEditMode = true;
      this.currentTask = { ...task };
      this.isModalOpen = true;
    });
  }

  closeModal() {
    this.ngZone.run(() => this.isModalOpen = false);
  }

  saveTask() {
    if (!this.currentTask.title || !this.currentTask.projectId || !this.currentTask.assigneeId) {
      this.toastr.warning('Title, Project, and Assignee are required!', 'Validation Error');
      return;
    }

    const apiCall = this.isEditMode ?
      this.taskService.updateTask(this.currentTask.id, this.currentTask) :
      this.taskService.addTask(this.currentTask);

    apiCall.subscribe({
      next: () => {
        this.ngZone.run(() => {
          this.isModalOpen = false;
          this.toastr.success(`Task ${this.isEditMode ? 'updated' : 'created'} successfully`, 'Success');
          this.loadTasks();
        });
      },
      error: () => this.ngZone.run(() => this.toastr.error('Operation failed', 'Error'))
    });
  }

  deleteTask(id: string) {
    if (confirm("Are you sure you want to delete this task?")) {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          this.ngZone.run(() => {
            this.isModalOpen = false;
            this.toastr.success('Task deleted successfully', 'Success');
            this.loadTasks();
          });
        }
      });
    }
  }

  // Helpers
  getPriorityClass(priority: string) {
    if (priority === 'HIGH') return 'priority-high';
    if (priority === 'MEDIUM') return 'priority-medium';
    return 'priority-low';
  }
}