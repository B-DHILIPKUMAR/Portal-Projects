import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../services/employee.services';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  userId: string = '';
  password: string = '';
  loading: boolean = false;

  // ✅ ✅ ✅ THIS WAS MISSING — NOW FIXED
  message: string = '';

  private LOGIN_URL = 'http://localhost:8000/login';

  constructor(
    private router: Router,
    private http: HttpClient,
    private customerService: CustomerService
  ) {}

  onLogin() {
    this.userId = this.userId.padStart(10, '0');
    if (!this.userId || !this.password) {
      this.message = 'Please enter User ID and Password';
      return;
    }

    this.loading = true;
    this.message = '';

    const body = {
      iEmpId: this.userId,
      iPassword: this.password
    };

    this.http.post<any>(this.LOGIN_URL, body).subscribe({
      next: (res) => {
        this.loading = false;

        if (res?.e_status === 'SUCCESS' || res?.success) {
          this.customerService.setLoggedUserId(this.userId);
          this.router.navigate(['/dashboard']);
        } else {
          this.message = res?.e_message || 'Invalid credentials';
        }
      },
      error: () => {
        this.loading = false;
        this.message = 'Server error. Please try again.';
      }
    });
  }
}
