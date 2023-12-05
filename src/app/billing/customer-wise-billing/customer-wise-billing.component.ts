import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { collection, getDocs, query, where } from 'firebase/firestore/lite';
import { FirbaseService } from 'src/app/firbase.service';

@Component({
  selector: 'app-customer-wise-billing',
  templateUrl: './customer-wise-billing.component.html',
  styleUrls: ['./customer-wise-billing.component.css'],
})
export class CustomerWiseBillingComponent implements OnInit {
  constructor(
    private firbaseService: FirbaseService,
    private datePipe: DatePipe
  ) {}
  customerList: any = [];
  customerDailyEntryList: any = [];
  keyword = 'name';
  filterFromDate: any = new Date();
  filterToDate: any = new Date();
  ngOnInit(): void {
    this.getCustomerList();
    this.filterFromDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.filterToDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }
  selectedCustomerData: any = {};
  async selectEvent(item: any) {
    this.selectedCustomerData = item;
    this.getCustomerDailyEntryList();
  }
  async getCustomerDailyEntryList() {
    if (this.selectedCustomerData.customerId != null) {
      var colData = collection(this.firbaseService.db, 'DailyJarEntry');
      const q = query(
        colData,
        where('isActive', '==', true),
        where('customerId', '==', this.selectedCustomerData.customerId),
        where(
          'entryTimestampDate',
          '>=',
          new Date(this.filterFromDate).getTime()
        ),
        where('entryTimestampDate', '<=', new Date(this.filterToDate).getTime())
      );
      const data = await getDocs(q);
      this.customerDailyEntryList = data.docs.map((doc) => doc.data());
      this.getPaymentEntryList();
    }
  }
  dailyPaymentEntryList: any = [];
  async getPaymentEntryList() {
    this.dailyPaymentEntryList = [];
    var colData = collection(this.firbaseService.db, 'payment');
    const q = query(
      colData,
      where('isActive', '==', true),
      where('customerId', '==', this.selectedCustomerData.customerId),
      where(
        'entryTimestampDate',
        '>=',
        new Date(this.filterFromDate).getTime()
      ),
      where('entryTimestampDate', '<=', new Date(this.filterToDate).getTime())
    );
    const data = await getDocs(q);
    this.dailyPaymentEntryList = data.docs.map((doc) => doc.data());
    console.log(this.dailyPaymentEntryList);
  }

  async getCustomerList() {
    var colData = collection(this.firbaseService.db, 'Customer');
    const citySnapshot = await getDocs(colData);
    var customerList: any = citySnapshot.docs.map((doc) => doc.data());
    customerList.forEach((element: any) => {
      element['id'] = element['customerId'];
      this.customerList.push(element);
    });
  }
  getTotalJar() {
    if (this.customerDailyEntryList.length > 0) {
      return this.customerDailyEntryList.reduce(
        (partialSum: any, a: any) => partialSum + a.NoJar,
        0
      );
    }
    return 0;
  }

  getTotalPurchseJarPrice() {
    if (this.customerDailyEntryList.length > 0) {
      return this.customerDailyEntryList.reduce(
        (partialSum: any, a: any) => partialSum + a.jarCalculatedPrice,
        0
      );
    }
    return 0;
  }
  getTotalPaidPayment() {
    if (this.dailyPaymentEntryList.length > 0) {
      return this.dailyPaymentEntryList.reduce(
        (partialSum: any, a: any) => partialSum + a.amount,
        0
      );
    }
    return 0;
  }
  
}
