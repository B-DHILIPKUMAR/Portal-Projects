import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../services/customer.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-inquiry',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './inquiry.component.html',
  styleUrls: ['./inquiry.component.css']
})
export class InquiryComponent implements OnInit {

  customerId: string | null = '';
  /** full list from API */
  private allInquiries: any[] = [];

  /** list currently shown in table (after search/filter) */
  inquiryList: any[] = [];

  loading = true;
  error = '';

  /** bound to search input */
  searchText = '';

 constructor(
  private http: HttpClient,
  private customerService: CustomerService,
  private location: Location
) {}


  ngOnInit(): void {
    this.customerId = this.customerService.getCustomerId();

    if (!this.customerId) {
      this.error = 'No Customer ID Found!';
      this.loading = false;
      return;
    }

    this.fetchInquiries();
  }
goBack() {
  this.location.back();
}

  fetchInquiries(): void {
    this.loading = true;

    this.http.get<any>(`http://localhost:3000/inquiry/${this.customerId}`)
      .subscribe({
        next: (res) => {
          // API returns { count, inquiries: [...] }
          this.allInquiries = res?.inquiries || [];
          this.inquiryList = [...this.allInquiries];
          this.loading = false;
        },
        error: () => {
          this.error = 'Unable to fetch inquiry details.';
          this.loading = false;
        }
      });
  }

  /** called whenever user types in search box */
  onSearchChange(): void {
    const term = this.searchText.trim().toLowerCase();

    if (!term) {
      this.inquiryList = [...this.allInquiries];
      return;
    }

    this.inquiryList = this.allInquiries.filter(item => {
      const inq   = (item.inquiryNo   || '').toString().toLowerCase();
      const date  = (item.itemDate    || '').toString().toLowerCase();
      const code  = (item.matCode     || '').toString().toLowerCase();
      const desc  = (item.description || '').toString().toLowerCase();
      const qty   = (item.orderQty    || '').toString().toLowerCase();
      const unit  = (item.unit        || '').toString().toLowerCase();
      const stat  = (item.status      || '').toString().toLowerCase();

      return (
        inq.includes(term) ||
        date.includes(term) ||
        code.includes(term) ||
        desc.includes(term) ||
        qty.includes(term) ||
        unit.includes(term) ||
        stat.includes(term)
      );
    });
  }

  clearSearch(): void {
    this.searchText = '';
    this.inquiryList = [...this.allInquiries];
  }
    /** ✅ UNIT FULL FORM */
  getUnitFullForm(unit: string): string {
    switch ((unit || '').toUpperCase()) {
      case 'EA': return 'EACH';
      case 'KG': return 'KILOGRAM';
      case 'IN': return 'INCH';
      default: return unit; // fallback if new code comes
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
