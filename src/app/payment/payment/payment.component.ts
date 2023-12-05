import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  doc,
  collection,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
} from 'firebase/firestore/lite';
import { FirbaseService } from 'src/app/firbase.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit {
  constructor(
    private firbaseService: FirbaseService,
    private datePipe: DatePipe
  ) {
    this.currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.filterDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  ngOnInit(): void {
    this.getCustomerList();
    this.getDailyEntryList();
  }
  keyword = 'name';
  customerList: any = [];
  dailyEntryList: any = [];
  currentDate: any = new Date();
  filterDate: any = new Date();
  amount: any = 0;
  selectedCustomer: any = null;
  searchText: string = '';
  selectEvent(item: any) {
    this.selectedCustomer = item;
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

  saveDailyEntry() {
    if (this.selectedCustomer != null && this.amount > 0) {
      if (!this.isEditEntry) {
        if (window.confirm('Are sure you want to add?')) {
          var paymentId = 'PI-' + new Date().valueOf();
          var obj = {
            paymentId: paymentId,
            customerId: this.selectedCustomer.customerId,
            name: this.selectedCustomer.name,
            amount: this.amount,
            month: this.getCurrentMoth(this.currentDate),
            entryDate: this.currentDate,
            entryTimestampDate: new Date(this.currentDate).getTime(),
            createddate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
            isActive: true,
          };
          setDoc(
            doc(this.firbaseService.db, 'payment', '' + paymentId),
            obj
          ).then(() => {
            this.selectedCustomer = null;
            this.getDailyEntryList();
            alert('Payment entry added successfully!');
          });
        }
      } else {
        if (window.confirm('Are sure you want to update?')) {
          this.selectedEntry.amount = this.amount;
          this.selectedEntry.entryDate = this.currentDate;
            updateDoc(
              doc(
                this.firbaseService.db,
                'payment',
                '' + this.selectedEntry.paymentId
              ),
              this.selectedEntry
            ).then(() => {
              alert('Payment entry updated successfully!');
              this.isEditEntry = false;
              this.selectedEntry = null;
              this.selectedCustomer = null;
              this.getDailyEntryList();
            });
        }
      }
    }
  }
  getCurrentMoth(date: any) {
    const month = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const d = new Date(date);
    return month[d.getMonth()];
  }
  async getDailyEntryList() {
    var colData = collection(this.firbaseService.db, 'payment');
    const q = query(
      colData,
      where('isActive', '==', true),
      where('entryDate', '==', this.filterDate)
    );
    const data = await getDocs(q);
    this.dailyEntryList = data.docs.map((doc) => doc.data());
    this.dailyEntryList = this.dailyEntryList.reverse();
  }

  deactivateEntry(data: any) {
    if (window.confirm('Are sure you want to delete?')) {
      data.isActive = false;
      updateDoc(
        doc(this.firbaseService.db, 'payment', '' + data.paymentId),
        data
      ).then(() => {
        alert('Payment entry deleted successfully!');
        this.getDailyEntryList();
      });
    }
  }
  isEditEntry: boolean = false;
  selectedEntry: any = null;
  editDailyEntry(data: any) {
    this.selectedEntry = data;
    this.isEditEntry = true;
    this.selectedCustomer = this.customerList.filter(
      (w: any) => w.customerId == data.customerId
    )[0];
    this.amount = data.amount;
    this.currentDate = data.entryDate;
  }
  closeWindow() {
    this.isEditEntry = false;
    this.selectedEntry = null;
    this.selectedCustomer = null;
  }

  getTotalPurchseJarPrice() {
    if (this.dailyEntryList.length > 0) {
      return this.dailyEntryList.reduce(
        (partialSum: any, a: any) => partialSum + a.amount,
        0
      );
    }
    return 0;
  }
}
