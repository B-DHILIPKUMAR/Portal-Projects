import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { VendorService } from '../services/vendor.services';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';


@Component({
  selector: 'app-payment',
  standalone: true,
  // imports: [CommonModule, HttpClientModule],
  imports: [CommonModule, HttpClientModule, FormsModule],

  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  paymentList: any[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  searchText: string = '';
filteredList: any[] = [];


  private readonly paymentApiUrl = 'http://localhost:8001/payment';

constructor(
  private http: HttpClient,
  private vendorService: VendorService,
  private router: Router,
  private location: Location
) {}


  ngOnInit() {
    const vendorId = this.vendorService.getVendorId();

    if (!vendorId) {
      this.router.navigate(['/']);
      return;
    }

    this.fetchPayments(vendorId);
  }

  fetchPayments(vendorId: string) {
    this.isLoading = true;

    const params = new HttpParams().set('VendorId', vendorId);

    this.http.get<any>(this.paymentApiUrl, { params }).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.paymentList = res?.data || [];
        this.filteredList = this.paymentList;

      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load Payment data';
        console.error('PAYMENT ERROR:', err);
      }
    });
  }
goBack() {
  this.location.back();   // ✅ goes to previous visited page
}

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
applyFilter() {
  const text = this.searchText.toLowerCase();

  this.filteredList = this.paymentList.filter(item =>
    item.InvoiceNumber?.toString().toLowerCase().includes(text) ||
    item.FiscalYear?.toString().toLowerCase().includes(text) ||
    item.Currency?.toLowerCase().includes(text)
  );
}

clearSearch() {
  this.searchText = '';
  this.filteredList = this.paymentList;
}

  logout() {
    this.vendorService.clearVendorId();
    this.router.navigate(['/']);
  }
}
