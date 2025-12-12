// import { Routes } from '@angular/router';

// import { LoginComponent } from './login/login.component';
// import { DashboardComponent } from './dashboard/dashboard.component';
// import { EmppayComponent } from './emppay/emppay.component';
// import { LeaveComponent } from './leave/leave.component';
// import { ProfileComponent } from './profile/profile.component';

// export const routes: Routes = [
//   { path: '', component: LoginComponent },

//   { path: 'dashboard', component: DashboardComponent },
//   { path: 'emppay', component: EmppayComponent },
//   { path: 'leave', component: LeaveComponent },
//   { path: 'profile', component: ProfileComponent },

//   { path: '**', redirectTo: '' }
// ];



import { Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmppayComponent } from './emppay/emppay.component';
import { LeaveComponent } from './leave/leave.component';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'emppay', component: EmppayComponent },
  { path: 'leave', component: LeaveComponent },
  { path: 'profile', component: ProfileComponent },

  // fallback
  { path: '**', redirectTo: '' }
];
