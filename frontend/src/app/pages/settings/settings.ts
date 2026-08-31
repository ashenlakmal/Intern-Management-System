import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../components/sidebar/sidebar';
import { ThemeService } from '../../services/theme';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './settings.html',
  styleUrls: ['./settings.css']
})
export class Settings implements OnInit {
  isSidebarCollapsed = false;

  userProfile = {
    firstName: '',
    lastName: '',
    email: '',
    role: 'ADMIN',
    avatarInitials: 'U'
  };

  passwords = {
    current: '',
    new: '',
    confirm: ''
  };

  constructor(
    public themeService: ThemeService,
    private toastr: ToastrService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadUserProfile();
    }
  }

  loadUserProfile() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.userProfile.firstName = user.firstName || 'Sarah';
      this.userProfile.lastName = user.lastName || 'Jenkins';
      this.userProfile.email = user.email || 'admin@internhub.com';
      this.userProfile.role = user.role || 'ADMIN';

      if (user.avatarInitials) {
        this.userProfile.avatarInitials = user.avatarInitials;
      } else if (this.userProfile.firstName) {
        this.userProfile.avatarInitials = this.userProfile.firstName.substring(0, 1).toUpperCase();
      }
    }
  }

  saveProfile() {
    if (!this.userProfile.firstName || !this.userProfile.lastName || !this.userProfile.email) {
      this.toastr.warning('Please fill all required fields.', 'Validation Error');
      return;
    }

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('user', JSON.stringify(this.userProfile));
    }
    this.toastr.success('Profile information updated successfully.', 'Success');
  }

  updatePassword() {
    if (!this.passwords.current || !this.passwords.new || !this.passwords.confirm) {
      this.toastr.warning('Please fill all password fields.', 'Validation Error');
      return;
    }

    if (this.passwords.new !== this.passwords.confirm) {
      this.toastr.error('New password and confirm password do not match.', 'Mismatch');
      return;
    }

    this.toastr.success('Password updated successfully.', 'Security Updated');
    this.passwords = { current: '', new: '', confirm: '' };
  }
}