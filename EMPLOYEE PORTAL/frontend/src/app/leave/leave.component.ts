
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CustomerService } from '../services/employee.services';

@Component({
  selector: 'app-leave',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.css']
})
export class LeaveComponent implements OnInit {

  userId = '';
  loading = true;
  errorMessage = '';
  leaves: any[] = [];

  private LEAVE_URL = 'http://localhost:8000/leave';

  constructor(
    private http: HttpClient,
    private customerService: CustomerService,
    private location: Location
  ) {}

  ngOnInit() {
    this.userId = this.customerService.getLoggedUserId();

    if (!this.userId) {
      this.errorMessage = 'Session expired. Please login again.';
      this.loading = false;
      return;
    }

    this.fetchLeaveData();
  }

  goBack() {
    this.location.back();
  }

  fetchLeaveData() {
    const url = `${this.LEAVE_URL}?empId=${this.userId}`;

    this.http.get<any>(url).subscribe({
      next: (res) => {
        this.loading = false;
        this.leaves = res.leave || [];
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Unable to load leave data.';
      }
    });
  }
}
