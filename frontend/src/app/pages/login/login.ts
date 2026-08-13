import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule], // Required for form handling
  templateUrl: './login.html', // Updated to match your file name
  styleUrl: './login.css'      // Updated to match your file name
})
export class Login {           // Updated class name to match your setup

  email = '';
  password = '';
  isLoading = false;

  constructor(
    private toastr: ToastrService,
    private router: Router
  ) { }

  onSubmit() {
    if (!this.email || !this.password) {
      this.toastr.warning('Please enter both email and password', 'Missing Fields');
      return;
    }

    this.isLoading = true; // Show loading spinner

    // Mock API call delay
    setTimeout(() => {
      this.isLoading = false;

      // Temporary authentication check for UI testing
      if (this.email === 'admin@test.com' && this.password === '123') {
        this.toastr.success('Welcome back to the dashboard!', 'Login Successful');
        // this.router.navigate(['/admin/dashboard']); 
      } else {
        this.toastr.error('Invalid email or password. Please try again.', 'Authentication Failed');
      }
    }, 2000);
  }
}