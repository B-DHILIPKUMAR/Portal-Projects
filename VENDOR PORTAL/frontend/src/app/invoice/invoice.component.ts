import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  HttpClient,
  HttpClientModule,
  HttpParams
} from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { VendorService } from '../services/vendor.services';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css'],
})
export class InvoiceComponent implements OnInit {

  vendorId: string | null = null;

  invoiceList: any[] = [];
  filteredInvoices: any[] = [];

  searchText: string = '';
  loading: boolean = true;
  errorMessage: string | null = null;

  loadingPdf: { [key: string]: boolean } = {};

  // Your backend base URL
  private readonly baseUrl = 'http://localhost:8001/api';
  private readonly pdfUrl = 'http://localhost:8001/api/pdf';

  constructor(
    private http: HttpClient,
    private vendorService: VendorService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    // 1️⃣ Get vendor ID from service (which you now store in localStorage)
    let storedVendorId = this.vendorService.getVendorId();
    console.log('RAW STORED VENDOR ID:', storedVendorId);

    if (!storedVendorId) {
      alert('Vendor ID missing. Please login again.');
      this.router.navigate(['/']);
      return;
    }

    // 2️⃣ SAP needs 10-digit vendor ID
    if (storedVendorId.length < 10) {
      storedVendorId = storedVendorId.padStart(10, '0');
    }

    this.vendorId = storedVendorId;
    console.log('FINAL VENDOR ID SENT TO API:', this.vendorId);

    // 3️⃣ Fetch invoice list
    this.fetchInvoices();
  }

  // -------------------------------------------------------
  // 1️⃣ FETCH INVOICE LIST
  // -------------------------------------------------------
  fetchInvoices() {
    if (!this.vendorId) return;

    this.loading = true;

    const params = new HttpParams().set('vendorId', this.vendorId);

    this.http.get<any>(this.baseUrl, { params }).subscribe({
      next: (res) => {
        console.log('INVOICE API RESPONSE:', res);

        this.invoiceList = res?.data || [];
        this.filteredInvoices = [...this.invoiceList];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching invoices:', err);
        this.loading = false;
        this.errorMessage = 'Failed to load invoice data';
      }
    });
  }

  // -------------------------------------------------------
  // 2️⃣ SEARCH / FILTER
  // -------------------------------------------------------
  search() {
    const t = this.searchText.toLowerCase();

    this.filteredInvoices = this.invoiceList.filter(inv =>
      (inv.invoiceNo || '').toLowerCase().includes(t) ||
      (inv.description || '').toLowerCase().includes(t) ||
      (inv.materialNo || '').toLowerCase().includes(t) ||
      (inv.poNo || '').toLowerCase().includes(t)
    );
  }

  clearSearch() {
    this.searchText = '';
    this.filteredInvoices = [...this.invoiceList];
  }

  // -------------------------------------------------------
  // 3️⃣ DOWNLOAD PDF
  // -------------------------------------------------------
  downloadPdf(invoiceNo: string) {
    this.loadingPdf[invoiceNo] = true;
    console.log('Downloading PDF for invoice:', invoiceNo);

    this.http
      .get(`${this.pdfUrl}/${invoiceNo}`, {
        responseType: 'blob',
      })
      .subscribe({
        next: (blob) => {
          this.loadingPdf[invoiceNo] = false;

          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `invoice_${invoiceNo}.pdf`;
          a.click();
          URL.revokeObjectURL(url);
        },
        error: (err) => {
          console.error('PDF Download Error:', err);
          this.loadingPdf[invoiceNo] = false;
          alert('Failed to download invoice PDF');
        },
      });
  }

  // -------------------------------------------------------
  // 4️⃣ NAVIGATION
  // -------------------------------------------------------
  goBack() {
    this.location.back();
  }

  logout() {
    this.vendorService.clearVendorId();
    this.router.navigate(['/']);
  }
}
