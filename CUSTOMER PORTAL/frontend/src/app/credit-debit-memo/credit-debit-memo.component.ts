import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CustomerService } from '../services/customer.service';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-credit-debit-memo',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './credit-debit-memo.component.html',
  styleUrls: ['./credit-debit-memo.component.css']
})
export class CreditDebitMemoComponent implements OnInit {

  customerId: string | null = '';
  memoList: any[] = [];
  filteredMemoList: any[] = [];

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

    this.fetchMemoData();
  }
goBack() {
  this.location.back();
}

  fetchMemoData() {
    this.http.get(`http://localhost:3000/memo/${this.customerId}`).subscribe({
      next: (res: any) => {
        this.memoList = res.memos || [];
        this.filteredMemoList = this.memoList;   // ✅ IMPORTANT
        this.loading = false;
      },
      error: () => {
        this.error = "Unable to fetch memo details.";
        this.loading = false;
      }
    });
  }

  // ✅ SEARCH FUNCTION
  applySearch() {
    const text = this.searchText.toLowerCase();

    this.filteredMemoList = this.memoList.filter(m =>
      m.bill_no.toLowerCase().includes(text) ||
      m.mat_code.toLowerCase().includes(text) ||
      m.currency.toLowerCase().includes(text)
    );
  }

  // ✅ CLEAR FUNCTION
  clearSearch() {
    this.searchText = '';
    this.filteredMemoList = this.memoList;
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
  /** ✅ BILL TYPE FULL FORM */
  getBillTypeFullForm(type: string): string {
    switch ((type || '').toUpperCase()) {
      case 'F2': return 'Invoice';
      case 'G2': return 'Credit Memo';
      case 'L2': return 'Debit Memo';
      default: return type;
    }
  }

}
