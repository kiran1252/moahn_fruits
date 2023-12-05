import { Component, OnInit } from '@angular/core';
import { doc, collection, getDocs, deleteDoc } from 'firebase/firestore/lite';
import { FirbaseService } from '../firbase.service';
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
})
export class CustomerComponent implements OnInit {
  constructor(private firbaseService: FirbaseService) {}
  customerList: any = [];
  searchText: string = '';
  ngOnInit() {
    this.getCustomerList();
  }

  deleteCustomer(customerId: any) {
    if (window.confirm('Are sure you want to delete this customer ?')) {
      const docRef = doc(this.firbaseService.db, 'Customer/' + customerId);
      deleteDoc(docRef)
        .then(() => {
          alert('Customer successfully deleted!');
          this.getCustomerList();
        })
        .catch(() => {
          console.log('Error removing document:');
        });
    }
  }
  async getCustomerList() {
    var colData = collection(this.firbaseService.db, 'Customer');
    const citySnapshot = await getDocs(colData);
    this.customerList = citySnapshot.docs.map((doc) => doc.data());
  }
}
