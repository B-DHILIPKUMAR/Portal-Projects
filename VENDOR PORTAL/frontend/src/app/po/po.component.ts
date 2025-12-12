import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { VendorService } from '../services/vendor.services';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';


@Component({
  selector: 'app-po',
  standalone: true,
imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './po.component.html',
  styleUrls: ['./po.component.css']
})
export class PoComponent implements OnInit {

  poList: any[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  searchText: string = '';
filteredList: any[] = [];


  private readonly poApiUrl = 'http://localhost:8001/po';

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

    this.fetchPO(vendorId);
  }

  fetchPO(vendorId: string) {
    this.isLoading = true;

    const params = new HttpParams().set('VendorId', vendorId);

    this.http.get<any>(this.poApiUrl, { params }).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.poList = res?.data || [];
        this.filteredList = this.poList;

      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load Purchase Order data';
        console.error('PO ERROR:', err);
      }
    });
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
goBack() {
  this.location.back();   // ✅ history-based navigation
}

applyFilter() {
  const text = this.searchText.toLowerCase();

  this.filteredList = this.poList.filter(item =>
    item.PoNumber?.toString().toLowerCase().includes(text) ||
    item.DocType?.toLowerCase().includes(text) ||
    item.Material?.toLowerCase().includes(text) ||
    item.Currency?.toLowerCase().includes(text)
  );
}

clearSearch() {
  this.searchText = '';
  this.filteredList = this.poList;
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
  if (type === 'NB') return 'NB (Standard PO)';
  return type;
}

  logout() {
    this.vendorService.clearVendorId();
    this.router.navigate(['/']);
  }
}
