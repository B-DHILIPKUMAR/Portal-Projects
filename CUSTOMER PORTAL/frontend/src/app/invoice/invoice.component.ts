// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { CustomerService } from '../services/customer.service';

// @Component({
//   selector: 'app-invoice',
//   standalone: true,
//   imports: [CommonModule, HttpClientModule],
//   templateUrl: './invoice.component.html',
//   styleUrls: ['./invoice.component.css']
// })
// export class InvoiceComponent implements OnInit {

//   customerId: string | null = null;
//   invoiceList: any[] = [];
//   loading = false;
//   errorMessage = '';
//   loadingPdf: { [key: string]: boolean } = {};

//   private baseUrl = 'http://localhost:3000/invoice/invoice';

//   constructor(
//     private http: HttpClient,
//     private customerService: CustomerService,
//   ) {}

//   ngOnInit(): void {
//     this.customerId = this.customerService.getCustomerId();
//     this.fetchInvoices();
//   }

//   fetchInvoices(): void {
//     if (!this.customerId) {
//       this.errorMessage = "Customer ID not found.";
//       return;
//     }

//     this.loading = true;

//     this.http.post<any>(`${this.baseUrl}/list`, { customerId: this.customerId }).subscribe({
//       next: (res: any) => {
//         this.invoiceList = res.invoices || [];
//         this.loading = false;
//       },
//       error: () => {
//         this.errorMessage = "Unable to fetch invoices.";
//         this.loading = false;
//       }
//     });
//   }

//   downloadPdf(invoiceNumber: string): void {
//     if (!invoiceNumber) return;
//     this.loadingPdf[invoiceNumber] = true;

//     this.http.post(
//       `${this.baseUrl}/pdf`,
//       { invoiceNumber },
//       { responseType: 'blob' }
//     ).subscribe({
//       next: (blob) => {
//         this.loadingPdf[invoiceNumber] = false;

//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = `invoice_${invoiceNumber}.pdf`;
//         document.body.appendChild(a);
//         a.click();
//         document.body.removeChild(a);
//         window.URL.revokeObjectURL(url);
//       },
//       error: () => {
//         this.loadingPdf[invoiceNumber] = false;
//         alert("Failed to download invoice PDF.");
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
  selector: 'app-invoice',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {

  customerId: string | null = null;

  invoiceList: any[] = [];
  filteredInvoiceList: any[] = [];

  loading = true;
  errorMessage = '';
  loadingPdf: { [key: string]: boolean } = {};
  searchText = '';

  private baseUrl = 'http://localhost:3000/invoice/invoice';

constructor(
  private http: HttpClient,
  private customerService: CustomerService,
  private location: Location
) {}


  ngOnInit(): void {
    this.customerId = this.customerService.getCustomerId();
    this.fetchInvoices();
  }
goBack() {
  this.location.back();
}

  fetchInvoices(): void {
    if (!this.customerId) {
      this.errorMessage = "Customer ID not found.";
      this.loading = false;
      return;
    }

    this.http.post<any>(`${this.baseUrl}/list`, { customerId: this.customerId })
      .subscribe({
        next: (res: any) => {
          this.invoiceList = res.invoices || [];
          this.filteredInvoiceList = this.invoiceList;   // ✅ IMPORTANT
          this.loading = false;
        },
        error: () => {
          this.errorMessage = "Unable to fetch invoices.";
          this.loading = false;
        }
      });
  }

  /* ✅ SEARCH */
  applySearch() {
    const value = this.searchText.toLowerCase();

    this.filteredInvoiceList = this.invoiceList.filter(inv =>
      inv.VBELN.toLowerCase().includes(value) ||
      inv.ARKTX.toLowerCase().includes(value) ||
      inv.WAERK.toLowerCase().includes(value)
    );
  }

  /* ✅ CLEAR */
  clearSearch() {
    this.searchText = '';
    this.filteredInvoiceList = this.invoiceList;
  }

  /* ✅ DOWNLOAD PDF (UNCHANGED) */
  downloadPdf(invoiceNumber: string): void {
    if (!invoiceNumber) return;

    this.loadingPdf[invoiceNumber] = true;

    this.http.post(
      `${this.baseUrl}/pdf`,
      { invoiceNumber },
      { responseType: 'blob' }
    ).subscribe({
      next: (blob) => {
        this.loadingPdf[invoiceNumber] = false;

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice_${invoiceNumber}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        this.loadingPdf[invoiceNumber] = false;
        alert("Failed to download invoice PDF.");
      }
    });
  }
}
