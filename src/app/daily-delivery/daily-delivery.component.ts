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
    this.getDailyEntryList();
  }
  keyword = 'name';
  dailyEntryList: any = [];
  currentDate: any = new Date();
  filterDate: any = new Date();
  amount: any = null;
  selectedCustomer: any = null;
  searchText: string = '';

  saveDailyEntry() {
    if (this.amount > 0) {
      if (!this.isEditEntry) {
        if (window.confirm('Are sure you want to add?')) {
          var dailyEntryId = 'DI-' + new Date().valueOf();
          var obj = {
            dailyEntryId: dailyEntryId,
            amount: this.amount,
            month: this.getCurrentMoth(this.currentDate),
            entryDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
            entryTimestampDate: new Date(this.currentDate).getTime(),
            createddate: this.datePipe.transform(this.currentDate, 'yyyy-MM-dd'),
            isActive: true
          };
          setDoc(
            doc(this.firbaseService.db, 'DailyIncomeEntry', '' + dailyEntryId),
            obj
          ).then(() => {
            this.getDailyEntryList();
            alert('Daily income entry added successfully!');
            this.amount = null;
          });
        }
      } else {
        if (window.confirm('Are sure you want to update?')) {
          this.selectedEntry.amount = this.amount;
          this.selectedEntry.createddate = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');
            updateDoc(
              doc(
                this.firbaseService.db,
                'DailyIncomeEntry',
                '' + this.selectedEntry.dailyEntryId
              ),
              this.selectedEntry
            ).then(() => {
              alert('Daily entry updated successfully!');
              this.isEditEntry = false;
              this.amount = null;
              this.selectedEntry = null;
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
    var colData = collection(this.firbaseService.db, 'DailyIncomeEntry');
    const q = query(
      colData,
      where('isActive', '==', true),
      where('createddate', '==', this.filterDate)
    );
    const data = await getDocs(q);
    this.dailyEntryList = data.docs.map((doc) => doc.data());
    this.dailyEntryList = this.dailyEntryList.reverse();
  }

  deactivateEntry(data: any) {
    if (window.confirm('Are sure you want to delete?')) {
      data.isActive = false;
      updateDoc(
        doc(this.firbaseService.db, 'DailyIncomeEntry', '' + data.dailyEntryId),
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
    this.amount = data.amount;
    this.currentDate = data.entryDate;
  }
  closeWindow() {
    this.isEditEntry = false;
    this.selectedEntry = null;
    this.selectedCustomer = null;
  }
}
