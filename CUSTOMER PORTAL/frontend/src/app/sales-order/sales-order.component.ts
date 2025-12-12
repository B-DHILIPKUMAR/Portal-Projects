// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-sales-order',
//   standalone: true,
//   imports: [CommonModule, HttpClientModule, FormsModule],
//   templateUrl: './sales-order.component.html',
//   styleUrls: ['./sales-order.component.css']
// })
// export class SalesOrderComponent implements OnInit {

//   salesList: any[] = [];
//   private allSales: any[] = [];

//   loading = true;
//   error = '';

//   searchText = '';

//   constructor(private http: HttpClient) {}

//   ngOnInit(): void {
//     this.fetchSales();
//   }

//   fetchSales(): void {
//     this.http.get<any>('http://localhost:3000/sales')
//       .subscribe({
//         next: (res) => {
//           this.allSales = res.sales || [];
//           this.salesList = [...this.allSales];
//           this.loading = false;
//         },
//         error: () => {
//           this.error = 'Unable to load sales orders.';
//           this.loading = false;
//         }
//       });
//   }

//   onSearchChange(): void {
//     const term = this.searchText.trim().toLowerCase();

//     if (!term) {
//       this.salesList = [...this.allSales];
//       return;
//     }

//     this.salesList = this.allSales.filter(order =>
//       (order.order_no?.toString().toLowerCase().includes(term)) ||
//       (order.order_date?.toLowerCase().includes(term)) ||
//       (order.mat_code?.toLowerCase().includes(term)) ||
//       (order.description?.toLowerCase().includes(term)) ||
//       (order.order_qty?.toString().includes(term)) ||
//       (order.unit?.toLowerCase().includes(term)) ||
//       (order.status?.toLowerCase().includes(term))
//     );
//   }

//   clearSearch(): void {
//     this.searchText = '';
//     this.salesList = [...this.allSales];
//   }
// }


import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../services/customer.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-sales-order',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './sales-order.component.html',
  styleUrls: ['./sales-order.component.css']
})
export class SalesOrderComponent implements OnInit {

  customerId: string | null = '';
  salesList: any[] = [];
  private allSales: any[] = [];

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
      this.error = "Customer ID not found.";
      this.loading = false;
      return;
    }

    this.fetchSales();
  }
goBack() {
  this.location.back();
}

  fetchSales(): void {
    const url = `http://localhost:3000/sales/${this.customerId}`;   // ✅ CORRECT PATTERN

    this.http.get<any>(url).subscribe({
      next: (res) => {
        this.allSales = res.sales || [];
        this.salesList = [...this.allSales];
        this.loading = false;
      },
      error: (err) => {
        console.error('Sales API Error:', err);
        this.error = 'Unable to load sales orders.';
        this.loading = false;
      }
    });
  }

  onSearchChange(): void {
    const term = this.searchText.trim().toLowerCase();

    if (!term) {
      this.salesList = [...this.allSales];
      return;
    }

    this.salesList = this.allSales.filter(order =>
      order.order_no?.toString().toLowerCase().includes(term) ||
      order.order_date?.toLowerCase().includes(term) ||
      order.mat_code?.toLowerCase().includes(term) ||
      order.description?.toLowerCase().includes(term) ||
      order.order_qty?.toString().includes(term) ||
      order.unit?.toLowerCase().includes(term) ||
      order.status?.toLowerCase().includes(term)
    );
  }

  clearSearch(): void {
    this.searchText = '';
    this.salesList = [...this.allSales];
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

  /** ✅ STATUS FULL FORM */
  getStatusFullForm(status: string): string {
    switch ((status || '').toUpperCase()) {
      case 'A': return 'Not Yet Processed';
      case 'B': return 'Partially Processed';
      case 'C': return 'Completely Processed';
      default: return status;
    }
  }

}
