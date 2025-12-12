import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profileData: any = {};
  loading = true;
  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {

    const customerId = localStorage.getItem("customerId");
    console.log("Customer ID received:", customerId);

    if (!customerId) {
      this.error = "Customer ID not found. Please login again.";
      this.loading = false;
      return;
    }

    const url = `http://localhost:3000/profile/${customerId}`;
    console.log("Calling backend:", url);

    this.http.get(url).subscribe({
      next: (res: any) => {

        console.log("RAW XML Response:", res);

        // 🔥 Correct mapping
        this.profileData = {
          customerId: res.customer_number || "",
          name: res.name || "",
          city: res.city || "",
          country: res.country || "",
          address: res.street || "",
          postalCode: res.postal || "",
          phone: "N/A",
          email: "N/A"
        };

        console.log("Mapped Profile:", this.profileData);

        this.loading = false;
      },

      error: () => {
        this.error = "Failed to load profile.";
        this.loading = false;
      }
    });
  }
}
