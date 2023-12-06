import { Component, OnInit } from '@angular/core';
import { doc, collection, getDocs, deleteDoc,query,
  where, } from 'firebase/firestore/lite';
import { FirbaseService } from '../firbase.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
})
export class CustomerComponent implements OnInit {
  constructor(private firbaseService: FirbaseService, private datePipe: DatePipe) {}
  dailyExpenceList: any = [];
  searchText: string = '';
  filterDate: any = new Date();
  ngOnInit() {
   
    this.filterDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.getCustomerList();
  }

  deleteCustomer(dailyExpenceId: any) {
    if (window.confirm('Are sure you want to delete this customer ?')) {
      const docRef = doc(this.firbaseService.db, 'dailyExpence/' + dailyExpenceId);
      deleteDoc(docRef)
        .then(() => {
          alert('daily expence successfully deleted!');
          this.getCustomerList();
        })
        .catch(() => {
          console.log('Error removing document:');
        });
    }
  }
  async getCustomerList() {
    var colData = collection(this.firbaseService.db, 'dailyExpence');
    const q = query(
      colData,
      where('currentDate', '==', this.filterDate)
    );
    const data = await getDocs(q);
    this.dailyExpenceList = data.docs.map((doc) => doc.data());
    // this.dailyExpenceList = this.dailyExpenceList.reverse();
  }
}
