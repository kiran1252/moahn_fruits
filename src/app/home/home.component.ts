import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { collection, getDocs, query, where } from 'firebase/firestore/lite';
import { FirbaseService } from '../firbase.service';
import { mapValues, groupBy, omit, sum, sumBy } from 'lodash';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(
    private firbaseService: FirbaseService,
    private datePipe: DatePipe
  ) {}
  totalExpence: any = 0;
  totalIncome: any = 0;
  dailyEntryList: any = [];
  filterDate: any = new Date();
  filterFromDate: any = new Date(new Date().getFullYear(), 0, 1);
  filterToDate: any = new Date(new Date().getFullYear(), 11, 31);
  title = 'ng2-charts-demo';

  public barChartLegend = true;
  public barChartPlugins = [];
  isShowChart:boolean = false;
  
  public barChartOptions: ChartOptions  = {
    responsive: false,
  };
  ngOnInit(): void {
    this.filterDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.getDailyEntryList();
    this.getCustomerList();
  }

  async getCustomerList() {
    var colData = collection(this.firbaseService.db, 'dailyExpence');
    const q = query(
      colData,
      where('currentDate', '==', this.filterDate)
    );
    const data = await getDocs(q);
    var dailyExpenceList = data.docs.map((doc) => doc.data());
    this.totalExpence = dailyExpenceList.reduce(
      (partialSum: any, a: any) => partialSum + a.amount,
      0
    );
    
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
    this.totalIncome = this.dailyEntryList.reduce(
      (partialSum: any, a: any) => partialSum + a.amount,
      0
    );
    
  }

  
}
