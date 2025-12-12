// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { CustomerService } from '../services/customer.service';

// @Component({
//   selector: 'app-overall-sales',
//   standalone: true,
//   imports: [CommonModule, HttpClientModule],
//   templateUrl: './overall-sales.component.html',
//   styleUrls: ['./overall-sales.component.css']
// })
// export class OverallSalesComponent implements OnInit {

//   customerId: string | null = '';
//   summaryList: any[] = [];
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

//     this.fetchSalesSummary();
//   }

//   fetchSalesSummary() {
//     const url = `http://localhost:3000/salessummary/${this.customerId}`;

//     this.http.get(url).subscribe({
//       next: (res: any) => {
//         this.summaryList = res.summary || [];
//         this.loading = false;
//       },
//       error: () => {
//         this.error = "Unable to load sales summary.";
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
  selector: 'app-overall-sales',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './overall-sales.component.html',
  styleUrls: ['./overall-sales.component.css']
})
export class OverallSalesComponent implements OnInit {

  customerId: string | null = '';
  summaryList: any[] = [];
  filteredSummaryList: any[] = [];

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

    this.fetchSalesSummary();
  }
goBack() {
  this.location.back();
}

  fetchSalesSummary() {
    this.http.get(`http://localhost:3000/salessummary/${this.customerId}`)
      .subscribe({
        next: (res: any) => {
          this.summaryList = res.summary || [];
          this.filteredSummaryList = this.summaryList;   // ✅ Important
          this.loading = false;
        },
        error: () => {
          this.error = "Unable to load sales summary.";
          this.loading = false;
        }
      });
  }

  /* ✅ SEARCH */
  applySearch() {
    const value = this.searchText.toLowerCase();

    this.filteredSummaryList = this.summaryList.filter(row =>
      row.billing_doc_no.toLowerCase().includes(value) ||
      row.material_no.toLowerCase().includes(value) ||
      row.currency.toLowerCase().includes(value)
    );
  }

  /* ✅ CLEAR */
  clearSearch() {
    this.searchText = '';
    this.filteredSummaryList = this.summaryList;
  }
    /** ✅ UNIT FULL FORM */
  getUnitFullForm(unit: string): string {
    switch ((unit || '').toUpperCase()) {
      case 'EA': return 'EACH';
      case 'KG': return 'KILOGRAM';
      case 'IN': return 'INCH';
      default: return unit;
    }
  }
  /** ✅ BILLING TYPE FULL FORM */
  getBillingTypeFullForm(type: string): string {
    switch ((type || '').toUpperCase()) {
      case 'F2': return 'Invoice';
      case 'G2': return 'Credit Memo';
      case 'L2': return 'Debit Memo';
      default: return type;
    }
  }

}
