
// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { CustomerService } from '../services/customer.service';

// @Component({
//   selector: 'app-payment',
//   standalone: true,
//   imports: [CommonModule, HttpClientModule],
//   templateUrl: './payment.component.html',
//   styleUrls: ['./payment.component.css']
// })
// export class PaymentComponent implements OnInit {

//   customerId: string | null = '';
//   paymentList: any[] = [];
//   loading = true;
//   error = '';

//   constructor(
//     private http: HttpClient,
//     private customerService: CustomerService
//   ) {}

//   ngOnInit(): void {
//     this.customerId = this.customerService.getCustomerId();

//     if (!this.customerId) {
//       this.error = "No Customer ID Found!";
//       this.loading = false;
//       return;
//     }

//     this.fetchPayments();
//   }

//   fetchPayments() {
//     const url = `http://localhost:3000/payment/${this.customerId}`;

//     this.http.get(url).subscribe({
//       next: (res: any) => {
//         this.paymentList = res.payments || [];
//         this.loading = false;
//       },
//       error: () => {
//         this.error = "Unable to load payment details.";
//         this.loading = false;
//       }
//     });
//   }
// }

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CustomerService } from '../services/customer.service';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  customerId: string | null = '';
  paymentList: any[] = [];
  filteredPayments: any[] = [];

  loading = true;
  error = '';
  searchText = '';

constructor(
  private http: HttpClient,
  private customerService: CustomerService,
  private location: Location
) {}


  ngOnInit(): void {
    this.customerId = this.customerService.getCustomerId();

    if (!this.customerId) {
      this.error = "No Customer ID Found!";
      this.loading = false;
      return;
    }

    this.fetchPayments();
  }
goBack() {
  this.location.back();
}

  fetchPayments() {
    this.http.get(`http://localhost:3000/payment/${this.customerId}`)
      .subscribe({
        next: (res: any) => {
          this.paymentList = res.payments || [];
          this.filteredPayments = this.paymentList;   // ✅ IMPORTANT
          this.loading = false;
        },
        error: () => {
          this.error = "Unable to load payment details.";
          this.loading = false;
        }
      });
  }

  // ✅ SEARCH FUNCTION
  applySearch() {
    const text = this.searchText.toLowerCase();

    this.filteredPayments = this.paymentList.filter(p =>
      p.billing_doc_no.toLowerCase().includes(text) ||
      p.currency.toLowerCase().includes(text)
    );
  }

  // ✅ CLEAR FUNCTION
  clearSearch() {
    this.searchText = '';
    this.filteredPayments = this.paymentList;
  }
}
