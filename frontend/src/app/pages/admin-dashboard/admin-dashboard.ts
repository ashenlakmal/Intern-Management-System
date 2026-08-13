import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar';
import { AdminService } from '../../services/admin';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboardComponent implements OnInit {

  isSidebarCollapsed = false;

  // Real user data from LocalStorage
  userName: string = 'User';
  userRole: string = 'Role';

  // Dashboard statistics object
  stats: any = {
    activeInterns: 0,
    activeProjects: 0,
    pendingTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    recentActivities: []
  };

  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.loadRealUserData();
    this.fetchDashboardStats();
  }

  // Extracts the logged-in user details saved during authentication
  loadRealUserData() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.userName = user.name;
      this.userRole = user.role;
    }
  }

  // Calls the Spring Boot API to get real counts
  fetchDashboardStats() {
    this.adminService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: (err) => console.error('Failed to load stats', err)
    });
  }

  // Dynamic status color mapping for the activity feed
  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'approved': return 'status-approved';
      case 'completed': return 'status-completed';
      case 'active': return 'status-active';
      case 'overdue': return 'status-overdue';
      default: return '';
    }
  }
}