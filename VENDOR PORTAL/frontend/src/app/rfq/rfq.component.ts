import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { VendorService } from '../services/vendor.services';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-rfq',
  standalone: true,
imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './rfq.component.html',
  styleUrls: ['./rfq.component.css']
})
export class RfqComponent implements OnInit {

  rfqList: any[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  searchText: string = '';
filteredList: any[] = [];


  private readonly rfqApiUrl = 'http://localhost:8001/rfq';

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

    this.fetchRfq(vendorId);
  }

  fetchRfq(vendorId: string) {
    this.isLoading = true;

    const params = new HttpParams().set('VendorId', vendorId);

    this.http.get<any>(this.rfqApiUrl, { params }).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.rfqList = res?.data || [];
        this.filteredList = this.rfqList;

      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load RFQ data';
        console.error('RFQ ERROR:', err);
      }
    });
  }
formatUnit(unit: string): string {
  if (!unit) return '';
  if (unit === 'EA') return 'EA - Each';
  if (unit === 'KG') return 'KG - Kilogram';
  return unit;
}

formatDocType(type: string): string {
  if (!type) return '';
  if (type === 'AN') return 'AN (RFQ)';
  return type;
}

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
goBack() {
  this.location.back();   // ✅ history-based back
}

applyFilter() {
  const text = this.searchText.toLowerCase();

  this.filteredList = this.rfqList.filter(item =>
    item.RfqNumber?.toString().toLowerCase().includes(text) ||
    item.DocType?.toLowerCase().includes(text) ||
    item.MatNumber?.toLowerCase().includes(text) ||
    item.Currency?.toLowerCase().includes(text)
  );
}

clearSearch() {
  this.searchText = '';
  this.filteredList = this.rfqList;
}

  logout() {
    this.vendorService.clearVendorId();
    this.router.navigate(['/']);
  }
}
