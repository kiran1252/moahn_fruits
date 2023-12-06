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
  ) { }
  filterFromDate: any = new Date();
  filterToDate: any = new Date();
  dailyEntryList: any = [];
  filterOtion: number = 1;
  filterDate: any = new Date();
  ngOnInit(): void {
    this.filterFromDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.filterToDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.getdailyExpence();
  }

  async getdailyExpence() {
    this.dailyEntryList = [];
    var colData = collection(this.firbaseService.db, 'dailyExpence');
    const q = query(
      colData,
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
    if (this.filterOtion == 1) {
      grouped = mapValues(groupBy(dataList, 'currentDate'), (clist) =>
        clist.map((car) => omit(car, 'currentDate'))
      );
    }
    if (this.filterOtion == 2) {
      grouped = mapValues(groupBy(dataList, 'month'), (clist) =>
        clist.map((car) => omit(car, 'month'))
      );
    }

    for (const key in grouped) {
      if (Object.prototype.hasOwnProperty.call(grouped, key)) {
        const element = grouped[key];
        var obj: any = {};
        obj.name = key;
        obj.expence = sumBy(element, 'amount');
        obj.income = 0;
        this.dailyEntryList.push(obj);
      }
    }
    this.getdailyIncome();
  }

  async getdailyIncome() {
    var colData = collection(this.firbaseService.db, 'DailyIncomeEntry');
    const q = query(
      colData,
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
    if (this.filterOtion == 1) {
      grouped = mapValues(groupBy(dataList, 'createddate'), (clist) =>
        clist.map((car) => omit(car, 'createddate'))
      );
    }
    if (this.filterOtion == 2) {
      grouped = mapValues(groupBy(dataList, 'month'), (clist) =>
        clist.map((car) => omit(car, 'month'))
      );
    }

    for (const key in grouped) {
      if (Object.prototype.hasOwnProperty.call(grouped, key)) {
        const element = grouped[key];
        
        var isexist = this.dailyEntryList.filter((w:any)=>w.name == key);
        if(isexist.length > 0){
          isexist[0].income = sumBy(element, 'amount');
        }else
        {
          var obj: any = {};
          obj.name = key;
          obj.income = sumBy(element, 'amount');
          obj.expence = 0;
          this.dailyEntryList.push(obj);
        }
      }
    }
  }


  getTotalExpence() {
    if (this.dailyEntryList.length > 0) {
      return this.dailyEntryList.reduce(
        (partialSum: any, a: any) => partialSum + a.expence,
        0
      );
    }
    return 0;
  }
  getTotalIncome() {
    if (this.dailyEntryList.length > 0) {
      return this.dailyEntryList.reduce(
        (partialSum: any, a: any) => partialSum + a.income,
        0
      );
    }
    return 0;
  }

}
