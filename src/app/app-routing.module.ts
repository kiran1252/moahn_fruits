import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.gaurd';
import { CustomerComponent } from './customer/customer.component';
import { NewCustomerComponent } from './customer/New/new-customer/new-customer.component';
import { DailyDeliveryComponent } from './daily-delivery/daily-delivery.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PaymentReportComponent } from './payment/payment-report/payment-report.component';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'home', component: HomeComponent,canActivate: [AuthGuard] },
  { path: 'new-cust', component: NewCustomerComponent,canActivate: [AuthGuard] },
  { path: 'new-cust/:id', component: NewCustomerComponent,canActivate: [AuthGuard] },
  { path: 'cust', component: CustomerComponent ,canActivate: [AuthGuard]},
  { path: 'delivery', component: DailyDeliveryComponent,canActivate: [AuthGuard] },
  { path: 'payment-report', component: PaymentReportComponent,canActivate: [AuthGuard] },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
