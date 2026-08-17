import { Component, OnInit, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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

  userName: string = 'User';
  userRole: string = 'Role';
  avatarInitials: string = 'U';

  // Dynamic Real Date
  currentDate: Date = new Date();

  stats: any = {
    activeInterns: 0,
    activeProjects: 0,
    pendingTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    recentActivities: []
  };

  constructor(
    private adminService: AdminService,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadRealUserData();
      this.fetchDashboardStats();
    }
  }

  loadRealUserData() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.ngZone.run(() => {
        // Handle name
        if (user.firstName && user.lastName) {
          this.userName = `${user.firstName} ${user.lastName}`;
        } else {
          this.userName = user.name || 'Admin';
        }

        this.userRole = user.role || 'Admin';

        // Handle Avatar Initials
        if (user.avatarInitials) {
          this.avatarInitials = user.avatarInitials;
        } else if (user.firstName) {
          this.avatarInitials = user.firstName.substring(0, 1).toUpperCase();
        }
      });
    }
  }

  fetchDashboardStats() {
    this.adminService.getDashboardStats().subscribe({
      next: (data) => {
        this.ngZone.run(() => {
          this.stats = data;
        });
      },
      error: (err) => console.error('Failed to load stats', err)
    });
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'approved': return 'status-approved';
      case 'completed': return 'status-completed';
      case 'active': return 'status-active';
      case 'overdue': return 'status-overdue';
      default: return 'status-active';
    }
  }
}