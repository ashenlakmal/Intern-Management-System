import { Component, OnInit, Inject, PLATFORM_ID, NgZone } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../components/sidebar/sidebar';
import { ThemeService } from '../../services/theme.service';
import { UserService } from '../../services/user.service';
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
  userId: string = '';

  userProfile = {
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    avatarInitials: '',
    designation: '',
    department: ''
  };

  skillsInput: string = '';

  passwords = {
    current: '',
    new: '',
    confirm: ''
  };

  constructor(
    public themeService: ThemeService,
    private userService: UserService,
    private toastr: ToastrService,
    private ngZone: NgZone,
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
      this.userId = user.id || user._id;

      this.userProfile.firstName = user.firstName || '';
      this.userProfile.lastName = user.lastName || '';
      this.userProfile.email = user.email || '';
      this.userProfile.role = user.role || '';
      this.userProfile.designation = user.designation || '';
      this.userProfile.department = user.department || '';
      this.userProfile.avatarInitials = user.avatarInitials || 'U';

      if (user.skills && Array.isArray(user.skills)) {
        this.skillsInput = user.skills.join(', ');
      }
    }
  }

  saveProfile() {
    if (!this.userProfile.firstName || !this.userProfile.lastName) {
      this.toastr.warning('First Name and Last Name are required.', 'Validation Error');
      return;
    }

    if (!this.userId) {
      this.toastr.error('User ID not found. Cannot update profile.', 'Error');
      return;
    }

    const skillsArray = this.skillsInput.split(',').map(s => s.trim()).filter(s => s !== '');

    const updateData = {
      firstName: this.userProfile.firstName,
      lastName: this.userProfile.lastName,
      designation: this.userProfile.designation,
      department: this.userProfile.department,
      skills: skillsArray
    };

    this.userService.updateProfile(this.userId, updateData).subscribe({
      next: (updatedUser) => {
        this.ngZone.run(() => {
          if (isPlatformBrowser(this.platformId)) {
            const currentStorage = JSON.parse(localStorage.getItem('user') || '{}');
            const newStorage = { ...currentStorage, ...updatedUser };
            localStorage.setItem('user', JSON.stringify(newStorage));
            this.loadUserProfile();
          }
          this.toastr.success('Profile updated in database successfully.', 'Success');
        });
      },
      error: (err) => {
        this.ngZone.run(() => this.toastr.error('Failed to update profile.', 'Database Error'));
        console.error(err);
      }
    });
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

    if (!this.userId) {
      this.toastr.error('User ID not found.', 'Error');
      return;
    }

    const payload = {
      currentPassword: this.passwords.current,
      newPassword: this.passwords.new
    };

    this.userService.changePassword(this.userId, payload).subscribe({
      next: () => {
        this.ngZone.run(() => {
          this.toastr.success('Password securely updated in database.', 'Security Updated');
          this.passwords = { current: '', new: '', confirm: '' };
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          if (err.status === 400) {
            this.toastr.error('The current password you entered is incorrect.', 'Authentication Failed');
          } else {
            this.toastr.error('Failed to change password.', 'Error');
          }
        });
      }
    });
  }
}