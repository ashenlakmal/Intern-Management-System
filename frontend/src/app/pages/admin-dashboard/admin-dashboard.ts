import { Component, OnInit, NgZone, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar';
import { AdminService } from '../../services/admin.service';

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
    private cdr: ChangeDetectorRef, // Added to strictly force UI updates
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadRealUserData();

      // Delay fetching slightly to bypass SSR hydration block (The Ultimate Fix!)
      setTimeout(() => {
        this.fetchDashboardStats();
      }, 150);
    }
  }

  loadRealUserData() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.ngZone.run(() => {
        if (user.firstName && user.lastName) {
          this.userName = `${user.firstName} ${user.lastName}`;
        } else {
          this.userName = user.name || 'Admin';
        }

        this.userRole = user.role || 'Admin';

        if (user.avatarInitials) {
          this.avatarInitials = user.avatarInitials;
        } else if (user.firstName) {
          this.avatarInitials = user.firstName.substring(0, 1).toUpperCase();
        }
        this.cdr.detectChanges(); // Force update profile info
      });
    }
  }

  fetchDashboardStats() {
    this.adminService.getDashboardStats().subscribe({
      next: (data) => {
        this.ngZone.run(() => {
          this.stats = data;
          this.cdr.detectChanges(); // Force Angular to update the HTML cards immediately!
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