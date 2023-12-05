import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FirbaseService } from 'src/app/firbase.service';
import { mapValues, groupBy, omit, sum, sumBy } from 'lodash';
import { collection, getDocs, query, where } from 'firebase/firestore/lite';

@Component({
  selector: 'app-payment-report',
  templateUrl: './payment-report.component.html',
  styleUrls: ['./payment-report.component.css'],
})
export class PaymentReportComponent implements OnInit {
  constructor(
    private firbaseService: FirbaseService,
    private datePipe: DatePipe
  ) {}
  filterFromDate: any = new Date();
  filterToDate: any = new Date();
  dailyEntryList: any = [];
  filterOtion: number = 1;

  ngOnInit(): void {
    this.filterFromDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.filterToDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.getDailyEntryList();
  }

  async getDailyEntryList() {
    this.dailyEntryList = [];
    var colData = collection(this.firbaseService.db, 'payment');
    const q = query(
      colData,
      where('isActive', '==', true),
      where(
        'entryTimestampDate',
        '>=',
        new Date(this.filterFromDate).getTime()
      ),
      where('entryTimestampDate', '<=', new Date(this.filterToDate).getTime())
    );
    const data = await getDocs(q);
    var dataList = data.docs.map((doc) => doc.data());
    var grouped: any = {};
    if (this.filterOtion != 1) {
      if (this.filterOtion == 2) {
        grouped = mapValues(groupBy(dataList, 'name'), (clist) =>
          clist.map((car) => omit(car, 'name'))
        );
      }
      if (this.filterOtion == 3) {
        grouped = mapValues(groupBy(dataList, 'entryDate'), (clist) =>
          clist.map((car) => omit(car, 'entryDate'))
        );
      }
      if (this.filterOtion == 4) {
        grouped = mapValues(groupBy(dataList, 'month'), (clist) =>
          clist.map((car) => omit(car, 'month'))
        );
      }
      for (const key in grouped) {
        if (Object.prototype.hasOwnProperty.call(grouped, key)) {
          const element = grouped[key];
          var obj: any = {};
          obj.name = key;
          obj.amount = sumBy(element, 'amount');
          this.dailyEntryList.push(obj);
        }
      }
    } else {
      this.dailyEntryList = dataList;
    }
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
        (partialSum: any, a: any) => partialSum + a.amount,
        0
      );
    }
    return 0;
  }
}
