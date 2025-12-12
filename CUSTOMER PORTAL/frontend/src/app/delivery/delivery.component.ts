import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../services/customer.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-delivery',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css']
})
export class DeliveryComponent implements OnInit {

  customerId: string | null = '';
  deliveries: any[] = [];
  private allDeliveries: any[] = [];

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
      this.error = "No Customer ID Found!";
      this.loading = false;
      return;
    }

    this.fetchDeliveryData();
  }
goBack() {
  this.location.back();
}

  fetchDeliveryData(): void {
    const url = `http://localhost:3000/delivery/${this.customerId}`;

    this.http.get<any>(url).subscribe({
      next: (res) => {
        this.allDeliveries = res.deliveries || [];
        this.deliveries = [...this.allDeliveries];
        this.loading = false;
      },
      error: (err) => {
        console.error('Delivery API Error:', err);
        this.error = "Unable to fetch delivery details.";
        this.loading = false;
      }
    });
  }

  // ✅ SEARCH
  onSearchChange(): void {
    const term = this.searchText.trim().toLowerCase();

    if (!term) {
      this.deliveries = [...this.allDeliveries];
      return;
    }

    this.deliveries = this.allDeliveries.filter(item =>
      item.delivery_no?.toLowerCase().includes(term) ||
      item.delivery_date?.toLowerCase().includes(term) ||
      item.mat_code?.toLowerCase().includes(term) ||
      item.description?.toLowerCase().includes(term) ||
      item.delivery_qty?.toString().includes(term) ||
      item.unit?.toLowerCase().includes(term) ||
      item.status?.toLowerCase().includes(term) ||
      item.gi_date?.toLowerCase().includes(term)
    );
  }

  // ✅ CLEAR
  clearSearch(): void {
    this.searchText = '';
    this.deliveries = [...this.allDeliveries];
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
