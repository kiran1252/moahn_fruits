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
  totalCustomer: any = 0;
  totalTodaysJar: any = 0;
  totalTodaysJarAmount: any = 0;
  dailyEntryList: any = [];
  filterDate: any = new Date();
  filterFromDate: any = new Date(new Date().getFullYear(), 0, 1);
  filterToDate: any = new Date(new Date().getFullYear(), 11, 31);
  title = 'ng2-charts-demo';

  public barChartLegend = true;
  public barChartPlugins = [];
  isShowChart:boolean = false;

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      { data: [], label: 'No of Jar' },
    ],
    
  };
  public barChartDataAmount: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      { data: [], label: 'Amount' }
    ],
  
  };
  
  public barChartOptions: ChartOptions  = {
    responsive: false,
  };
  ngOnInit(): void {
    this.getCustomerList();
    this.filterDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.filterFromDate = this.datePipe.transform(this.filterFromDate, 'yyyy-MM-dd');
    this.filterToDate = this.datePipe.transform(this.filterToDate, 'yyyy-MM-dd');
    this.getDailyEntryForBarchartList();
    this.getDailyEntryList();
  }

  async getCustomerList() {
    var colData = collection(this.firbaseService.db, 'Customer');
    const citySnapshot = await getDocs(colData);
    var customerList: any = citySnapshot.docs.map((doc) => doc.data());
    this.totalCustomer = customerList.length;
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
    this.totalTodaysJar = this.dailyEntryList.reduce(
      (partialSum: any, a: any) => partialSum + a.NoJar,
      0
    );
    this.totalTodaysJarAmount = this.dailyEntryList.reduce(
      (partialSum: any, a: any) => partialSum + a.jarCalculatedPrice,
      0
    );
  }

  async getDailyEntryForBarchartList() {
    this.dailyEntryList = [];
    var colData = collection(this.firbaseService.db, 'DailyJarEntry');
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
    grouped = mapValues(groupBy(dataList, 'month'), (clist) =>
      clist.map((car) => omit(car, 'month'))
    );
    for (const key in grouped) {
      if (Object.prototype.hasOwnProperty.call(grouped, key)) {
        const element = grouped[key];
        this.barChartData.labels?.push(key);
        this.barChartDataAmount.labels?.push(key);
        this.barChartData.datasets[0].data.push(sumBy(element, 'NoJar'));
        this.barChartDataAmount.datasets[0].data.push(
          sumBy(element, 'jarCalculatedPrice')
        );
      }
    }
    this.isShowChart = true;
  }
}
