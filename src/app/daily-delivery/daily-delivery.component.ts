import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  doc,
  collection,
  getDocs,
  deleteDoc,
  setDoc,
  updateDoc,
  query,
  where,
} from 'firebase/firestore/lite';
import { FirbaseService } from '../firbase.service';

@Component({
  selector: 'app-daily-delivery',
  templateUrl: './daily-delivery.component.html',
  styleUrls: ['./daily-delivery.component.css'],
})
export class DailyDeliveryComponent implements OnInit {
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
  numberOfJar: any = 0;
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
    if (this.selectedCustomer != null && this.numberOfJar > 0) {
      if (!this.isEditEntry) {
        if (window.confirm('Are sure you want to add?')) {
          var dailyEntryId = 'DI-' + new Date().valueOf();
          var obj = {
            dailyEntryId: dailyEntryId,
            customerId: this.selectedCustomer.customerId,
            name: this.selectedCustomer.name,
            NoJar: this.numberOfJar,
            month: this.getCurrentMoth(this.currentDate),
            purchaseRate: this.selectedCustomer.rate,
            jarCalculatedPrice: this.numberOfJar * this.selectedCustomer.rate,
            entryDate: this.currentDate,
            entryTimestampDate: new Date(this.currentDate).getTime(),
            createddate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
            isActive: true,
          };
          setDoc(
            doc(this.firbaseService.db, 'DailyJarEntry', '' + dailyEntryId),
            obj
          ).then(() => {
            this.selectedCustomer = null;
            this.getDailyEntryList();
            alert('Daily jar entry added successfully!');
          });
        }
      } else {
        if (window.confirm('Are sure you want to update?')) {
          this.selectedEntry.NoJar = this.numberOfJar;
          this.selectedEntry.entryDate = this.currentDate;
          (this.selectedEntry.purchaseRate = this.selectedCustomer.rate),
            (this.selectedEntry.jarCalculatedPrice =
              this.numberOfJar * this.selectedCustomer.rate),
            updateDoc(
              doc(
                this.firbaseService.db,
                'DailyJarEntry',
                '' + this.selectedEntry.dailyEntryId
              ),
              this.selectedEntry
            ).then(() => {
              alert('Daily entry updated successfully!');
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
    var colData = collection(this.firbaseService.db, 'DailyJarEntry');
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
        doc(this.firbaseService.db, 'DailyJarEntry', '' + data.dailyEntryId),
        data
      ).then(() => {
        alert('Daily entry deleted successfully!');
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
    this.numberOfJar = data.NoJar;
    this.currentDate = data.entryDate;
  }
  closeWindow() {
    this.isEditEntry = false;
    this.selectedEntry = null;
    this.selectedCustomer = null;
  }
  getTotalJar() {
    if (this.dailyEntryList.length > 0) {
      return this.dailyEntryList.reduce(
        (partialSum: any, a: any) => partialSum + a.NoJar,
        0
      );
    }
    return 0;
  }

  getTotalPurchseJarPrice() {
    if (this.dailyEntryList.length > 0) {
      return this.dailyEntryList.reduce(
        (partialSum: any, a: any) => partialSum + a.jarCalculatedPrice,
        0
      );
    }
    return 0;
  }
}
