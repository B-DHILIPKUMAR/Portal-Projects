// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-profile',
//   imports: [],
//   templateUrl: './profile.component.html',
//   styleUrl: './profile.component.css'
// })
// export class ProfileComponent {

// }

import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CustomerService } from '../services/employee.services';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userId = '';
  loading = true;
  errorMessage = '';
  profile: any = null;

  private PROFILE_URL = 'http://localhost:8000/profile';

  // constructor(
  //   private http: HttpClient,
  //   private customerService: CustomerService
  // ) {}
constructor(
  private http: HttpClient,
  private customerService: CustomerService,
  private location: Location
) {}

  ngOnInit() {
    this.userId = this.customerService.getLoggedUserId();
    if (!this.userId) {
      this.errorMessage = 'Session expired. Please login again.';
      this.loading = false;
      return;
    }
    this.getProfile();
  }
goBack() {
  this.location.back();
}

  getProfile() {
    const url = `${this.PROFILE_URL}?iEmpId=${this.userId}`;
    this.http.get<any>(url).subscribe({
      next: (res) => {
        this.loading = false;
        this.profile = res?.profileData || {};
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Unable to fetch profile. Try again later.';
      }
    });
  }
}
