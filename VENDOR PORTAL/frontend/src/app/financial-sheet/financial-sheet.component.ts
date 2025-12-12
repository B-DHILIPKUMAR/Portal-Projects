import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VendorService } from '../services/vendor.services';

@Component({
  selector: 'app-financial-sheet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './financial-sheet.component.html',
  styleUrls: ['./financial-sheet.component.css']
})
export class FinancialSheetComponent implements OnInit {

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
  goToProfile() {
    this.router.navigate(['/profile']);
  }
  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
goToCreditDebit() {
  this.router.navigate(['/credit-debit']);
}
goToPayment() {
  this.router.navigate(['/payment']);
}
goToInvoice() {
  this.router.navigate(['/invoice']);
}

  logout() {
    this.vendorService.clearVendorId();
    this.router.navigate(['/']);
  }
}
