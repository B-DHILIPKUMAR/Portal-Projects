import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
 
export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
 
  { path: 'profile', loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent) },
 
  { path: 'inquiry', loadComponent: () => import('./inquiry/inquiry.component').then(m => m.InquiryComponent) },
  { path: 'sales-order', loadComponent: () => import('./sales-order/sales-order.component').then(m => m.SalesOrderComponent) },
  { path: 'delivery', loadComponent: () => import('./delivery/delivery.component').then(m => m.DeliveryComponent) },
 
  { path: 'invoice', loadComponent: () => import('./invoice/invoice.component').then(m => m.InvoiceComponent) },
  { path: 'payment', loadComponent: () => import('./payment/payment.component').then(m => m.PaymentComponent) },
  { path: 'credit-debit-memo', loadComponent: () => import('./credit-debit-memo/credit-debit-memo.component').then(m => m.CreditDebitMemoComponent) },
  { path: 'overall-sales', loadComponent: () => import('./overall-sales/overall-sales.component').then(m => m.OverallSalesComponent) },
];