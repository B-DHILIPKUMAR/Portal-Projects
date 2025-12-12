import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { VendorService } from '../services/vendor.services';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-credit-debit',
  standalone: true,
imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './creditdebit.component.html',
  styleUrls: ['./creditdebit.component.css']
})
export class CreditDebitComponent implements OnInit {

  creditDebitList: any[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  searchText: string = '';
filteredList: any[] = [];


  private readonly creditDebitApiUrl = 'http://localhost:8001/credit-debit';

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

    this.fetchCreditDebit(vendorId);
  }

  fetchCreditDebit(vendorId: string) {
    this.isLoading = true;

    const params = new HttpParams().set('VendorId', vendorId);

    this.http.get<any>(this.creditDebitApiUrl, { params }).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.creditDebitList = res?.data || [];
        this.filteredList = this.creditDebitList;

      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load Credit / Debit Memo data';
        console.error('CREDIT DEBIT ERROR:', err);
      }
    });
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
goBack() {
  this.location.back();   // ✅ history-based back
}
applyFilter() {
  const text = this.searchText.toLowerCase();

  this.filteredList = this.creditDebitList.filter(item =>
    item.MemoNumber?.toString().toLowerCase().includes(text) ||
    item.FiscalYear?.toString().toLowerCase().includes(text) ||
    item.Currency?.toLowerCase().includes(text) ||
    item.DocType?.toLowerCase().includes(text)
  );
}

clearSearch() {
  this.searchText = '';
  this.filteredList = this.creditDebitList;
}
formatDocType(type: string): string {
  if (!type) return '';

  if (type === 'AN') return 'AN (RFQ)';
  if (type === 'NB') return 'NB (Standard PO)';
  if (type === 'RE') return 'RE (Debit)';

  return type; // fallback if any new value comes
}

  logout() {
    this.vendorService.clearVendorId();
    this.router.navigate(['/']);
  }
}
