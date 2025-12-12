import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { VendorService } from '../services/vendor.services';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  private readonly loginApiUrl = 'http://localhost:8001/login';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private vendorService: VendorService
  ) {
    this.loginForm = this.fb.group({
      vendorId: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get vendorId() {
    return this.loginForm.get('vendorId');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    this.errorMessage = null;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    let vendorIdValue = String(this.vendorId?.value).trim();
    let passwordValue = String(this.password?.value).trim();

    // ✅ ZERO PADDING
    vendorIdValue = vendorIdValue.padStart(10, '0');
    passwordValue = passwordValue.padStart(5, '0');

    this.isLoading = true;

    const params = new HttpParams()
      .set('VendorId', vendorIdValue)
      .set('Password', passwordValue);

    this.http.get<any>(this.loginApiUrl, { params }).subscribe({
      next: (res) => {
        this.isLoading = false;
        const data = res?.data;

        if (res?.message === 'Login successful' && data?.VendorId) {
          this.vendorService.setVendorId(data.VendorId);
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = 'Invalid User ID or Password.';
        }
      },

      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Login failed. Please try again later.';
        console.error('LOGIN ERROR FULL:', err);
      }
    });
  }
}
