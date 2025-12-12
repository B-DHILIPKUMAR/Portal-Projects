// dashboard.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
 
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
 
  sideNavOpen = false;
  financialExpanded = false;
 
  constructor(private router: Router) {}
 
  toggleSideNav() {
    this.sideNavOpen = !this.sideNavOpen;
  }
 
  logout() {
    this.router.navigateByUrl('/');
  }
 
  goTo(path: string) {
    this.sideNavOpen = false;
    this.router.navigateByUrl(path);
  }
 
  toggleFinancial() {
    this.financialExpanded = !this.financialExpanded;
  }
}