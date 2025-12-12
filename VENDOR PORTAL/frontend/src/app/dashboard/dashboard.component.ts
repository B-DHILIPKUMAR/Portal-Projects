import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VendorService } from '../services/vendor.services';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  vendorId: string | null = null;

  constructor(
    private vendorService: VendorService,
    private router: Router
  ) {}

  ngOnInit() {
    this.vendorId = this.vendorService.getVendorId();

    if (!this.vendorId) {
      this.router.navigate(['/']);
    }
  }

  goToRfq() {
    this.router.navigate(['/rfq']);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }
goToFinancialSheet() {
  this.router.navigate(['/financial-sheet']);
}
goToPo() {
  this.router.navigate(['/po']);
}
goToGr() {
  this.router.navigate(['/gr']);
}

  logout() {
    this.vendorService.clearVendorId();
    this.router.navigate(['/']);
  }
}
