import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { VendorService } from '../services/vendor.services';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  vendorProfile: any = null;
  isLoading = false;
  errorMessage: string | null = null;

  private readonly profileApiUrl = 'http://localhost:8001/profile';

  constructor(
    private http: HttpClient,
    private router: Router,
    private vendorService: VendorService
  ) {}

  ngOnInit() {
    const vendorId = this.vendorService.getVendorId();

    if (!vendorId) {
      this.router.navigate(['/']);
      return;
    }

    this.fetchProfile(vendorId);
  }

  fetchProfile(vendorId: string) {
    this.isLoading = true;

    const params = new HttpParams().set('VendorId', vendorId);

    this.http.get<any>(this.profileApiUrl, { params }).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.vendorProfile = res?.data;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load vendor profile';
        console.error('PROFILE ERROR:', err);
      }
    });
  }

  logout() {
    this.vendorService.clearVendorId();
    this.router.navigate(['/']);
  }
}
