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
      const localUser = JSON.parse(userStr);
      this.userId = localUser.id || localUser._id;

      if (this.userId) {
        this.userService.getUserById(this.userId).subscribe({
          next: (dbUser) => {
            this.ngZone.run(() => {
              this.userProfile.firstName = dbUser.firstName || '';
              this.userProfile.lastName = dbUser.lastName || '';
              this.userProfile.email = dbUser.email || '';
              this.userProfile.role = dbUser.role || '';
              this.userProfile.designation = dbUser.designation || '';
              this.userProfile.department = dbUser.department || '';
              this.userProfile.avatarInitials = dbUser.avatarInitials || 'U';

              if (dbUser.skills && Array.isArray(dbUser.skills)) {
                this.skillsInput = dbUser.skills.join(', ');
              } else {
                this.skillsInput = '';
              }

              localStorage.setItem('user', JSON.stringify(dbUser));
            });
          },
          error: (err) => console.error('Failed to load fresh user data', err)
        });
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
          localStorage.setItem('user', JSON.stringify(updatedUser));
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