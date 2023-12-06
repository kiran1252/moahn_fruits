import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CustomerComponent } from './customer/customer.component';
import { NewCustomerComponent } from './customer/New/new-customer/new-customer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { FilterPipe } from './filter.pipe';
import { FormsModule } from '@angular/forms';
import { DailyDeliveryComponent } from './daily-delivery/daily-delivery.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { DatePipe } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.gaurd';
import { NgChartsModule } from 'ng2-charts';
import { PaymentReportComponent } from './payment/payment-report/payment-report.component';
@NgModule({
  declarations: [
    AppComponent,
    CustomerComponent,
    NewCustomerComponent,
    HomeComponent,
    FilterPipe,
    DailyDeliveryComponent,
    LoginComponent,
    PaymentReportComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AutocompleteLibModule,
    ReactiveFormsModule,
    FormsModule,NgChartsModule
  ],
  providers: [DatePipe, AuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
