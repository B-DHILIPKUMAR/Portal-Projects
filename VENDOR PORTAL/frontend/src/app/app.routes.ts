import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { RfqComponent } from './rfq/rfq.component';
import { FinancialSheetComponent } from './financial-sheet/financial-sheet.component';
import { PoComponent } from './po/po.component';
import { GrComponent } from './gr/gr.component';
import { CreditDebitComponent } from './creditdebit/creditdebit.component';
import { PaymentComponent } from './payment/payment.component';
import { InvoiceComponent } from './invoice/invoice.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'rfq', component: RfqComponent },
  { path: 'financial-sheet', component: FinancialSheetComponent },
  { path: 'po', component: PoComponent },
  { path: 'gr', component: GrComponent },
  { path: 'credit-debit', component: CreditDebitComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'invoice', component: InvoiceComponent }


];
