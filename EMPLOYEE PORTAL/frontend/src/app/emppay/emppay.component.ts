// // import { Component } from '@angular/core';

// // @Component({
// //   selector: 'app-emppay',
// //   imports: [],
// //   templateUrl: './emppay.component.html',
// //   styleUrl: './emppay.component.css'
// // })
// // export class EmppayComponent {

// // }

// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { CustomerService } from '../services/employee.services';

// @Component({
//   selector: 'app-emppay',
//   standalone: true,
//   imports: [CommonModule, HttpClientModule],
//   templateUrl: './emppay.component.html',
//   styleUrls: ['./emppay.component.css']
// })
// export class EmppayComponent implements OnInit {

//   userId = '';
//   loading = true;
//   errorMessage = '';
//   salaryList: any[] = [];

//   private BASE_URL = 'http://localhost:8000/emppay';

//   constructor(
//     private http: HttpClient,
//     private customerService: CustomerService
//   ) {}

//   ngOnInit() {
//     this.userId = this.customerService.getLoggedUserId();

//     if (!this.userId) {
//       this.errorMessage = "Session expired. Please login again.";
//       this.loading = false;
//       return;
//     }

//     this.fetchSalaryData();
//   }

//   fetchSalaryData() {
//     const url = `${this.BASE_URL}?empId=${this.userId}`;

//     this.http.get<any>(url).subscribe({
//       next: (res) => {
//         this.loading = false;
//         this.salaryList = res.emppay || [];
//       },
//       error: () => {
//         this.loading = false;
//         this.errorMessage = "Unable to load salary details.";
//       }
//     });
//   }

//   downloadPDF() {
//     const url = `${this.BASE_URL}/pdf?empId=${this.userId}`;
//     window.open(url, "_blank");
//   }
// }


// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { CustomerService } from '../services/employee.services';

// @Component({
//   selector: 'app-emppay',
//   standalone: true,
//   imports: [CommonModule, HttpClientModule],
//   templateUrl: './emppay.component.html',
//   styleUrls: ['./emppay.component.css']
// })
// export class EmppayComponent implements OnInit {

//   userId = '';
//   loading = true;
//   errorMessage = '';
//   salaryList: any[] = [];

//   private BASE_URL = 'http://localhost:8000/emppay';

//   constructor(
//     private http: HttpClient,
//     private customerService: CustomerService
//   ) {}

//   ngOnInit() {
//     this.userId = this.customerService.getLoggedUserId();

//     if (!this.userId) {
//       this.errorMessage = "Session expired. Please login again.";
//       this.loading = false;
//       return;
//     }

//     this.fetchSalaryData();
//   }

//   fetchSalaryData() {
//     const url = `${this.BASE_URL}?empId=${this.userId}`;

//     this.http.get<any>(url).subscribe({
//       next: (res) => {
//         this.loading = false;
//         this.salaryList = res.emppay || [];
//       },
//       error: () => {
//         this.loading = false;
//         this.errorMessage = "Unable to load salary details.";
//       }
//     });
//   }

//   downloadPDF() {
//     const url = `${this.BASE_URL}/pdf?empId=${this.userId}`;
//     window.open(url, "_blank");
//   }
// }

import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CustomerService } from '../services/employee.services';

@Component({
  selector: 'app-emppay',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './emppay.component.html',
  styleUrls: ['./emppay.component.css']
})
export class EmppayComponent implements OnInit {

  userId = '';
  loading = true;
  errorMessage = '';
  salaryList: any[] = [];

  private BASE_URL = 'http://localhost:8000/emppay';

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
      this.errorMessage = "Session expired. Please login again.";
      this.loading = false;
      return;
    }

    this.fetchSalaryData();
  }
goBack() {
  this.location.back();
}

  fetchSalaryData() {
    const url = `${this.BASE_URL}?empId=${this.userId}`;

    this.http.get<any>(url).subscribe({
      next: (res) => {
        this.loading = false;
        this.salaryList = res.emppay || [];
      },
      error: () => {
        this.loading = false;
        this.errorMessage = "Unable to load salary details.";
      }
    });
  }

  downloadPDF() {
    const url = `${this.BASE_URL}/pdf?empId=${this.userId}`;
    window.open(url, "_blank");
  }
}
