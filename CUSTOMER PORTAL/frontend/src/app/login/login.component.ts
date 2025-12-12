import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CustomerService } from '../services/customer.service';
 
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
 
  userId: string = '';
  password: string = '';
 
  constructor(
    private http: HttpClient,
    private router: Router,
    private customerService: CustomerService
  ) {}
 
  onLogin() {
 this.userId = this.userId.padStart(10, '0');
    const body = {
      customerId: this.userId,
      password: this.password
    };
 
    this.http.post<any>('http://localhost:3000/login', body)
      .subscribe({
        next: (res) => {
 
          if (res.status === "X") {
 
            // Save ID
            this.customerService.setCustomerId(this.userId);
 
            alert("Login Success!");
 
            // Navigate
            this.router.navigateByUrl('/dashboard');
 
          } else {
            alert(res.message || "Invalid Login");
          }
 
        },
        error: () => alert("Server error")
      });
  }
}