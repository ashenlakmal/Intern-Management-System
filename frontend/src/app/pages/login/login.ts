import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth'; // Added service import

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  email = '';
  password = '';
  isLoading = false;

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private authService: AuthService // Injected AuthService
  ) { }

  onSubmit() {
    if (!this.email || !this.password) {
      this.toastr.warning('Please enter both email and password', 'Missing Fields');
      return;
    }

    this.isLoading = true;

    // Prepare data to send to backend
    const loginData = {
      email: this.email,
      password: this.password
    };

    // Call the Spring Boot backend
    this.authService.login(loginData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.toastr.success('Welcome back to the dashboard!', 'Login Successful');

        // Save user data to local storage
        localStorage.setItem('user', JSON.stringify(response));

        // Navigate to the admin dashboard after successful login
        this.router.navigate(['/admin/dashboard']);
      },

      error: (error) => {
        // Fixes the NG0100 Angular Error
        setTimeout(() => {
          this.isLoading = false;
        });

        this.toastr.error('Invalid email or password. Please try again.', 'Authentication Failed');
        console.error('Login error', error);
      }
    });
  }
}