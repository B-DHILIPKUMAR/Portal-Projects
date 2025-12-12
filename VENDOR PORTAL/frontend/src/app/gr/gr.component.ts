import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { VendorService } from '../services/vendor.services';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-gr',
  standalone: true,
imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './gr.component.html',
  styleUrls: ['./gr.component.css']
})
export class GrComponent implements OnInit {

  grList: any[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  searchText: string = '';
filteredList: any[] = [];


  private readonly grApiUrl = 'http://localhost:8001/gr';

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

    this.fetchGR(vendorId);
  }

  fetchGR(vendorId: string) {
    this.isLoading = true;

    const params = new HttpParams().set('VendorId', vendorId);

    this.http.get<any>(this.grApiUrl, { params }).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.grList = res?.data || [];
        this.filteredList = this.grList;

      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load Goods Receipt data';
        console.error('GR ERROR:', err);
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

  this.filteredList = this.grList.filter(item =>
    item.MaterialDoc?.toString().toLowerCase().includes(text) ||
    item.DocYear?.toString().toLowerCase().includes(text) ||
    item.Material?.toLowerCase().includes(text) ||
    item.PoNumber?.toString().toLowerCase().includes(text)
  );
}

clearSearch() {
  this.searchText = '';
  this.filteredList = this.grList;
}
formatUnit(unit: string): string {
  if (!unit) return '';
  if (unit === 'EA') return 'EA - Each';
  if (unit === 'KG') return 'KG - Kilogram';
  return unit;
}

  logout() {
    this.vendorService.clearVendorId();
    this.router.navigate(['/']);
  }
}
