import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { doc, setDoc, updateDoc, getDoc } from 'firebase/firestore/lite';
import { FirbaseService } from 'src/app/firbase.service';
@Component({
  selector: 'app-new-customer',
  templateUrl: './new-customer.component.html',
  styleUrls: ['./new-customer.component.css'],
})
export class NewCustomerComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private firbaseService: FirbaseService,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) {}
  myForm: any;
  customerId: any = null;
  ngOnInit(): void {
    this.myForm = this.fb.group({
      customerId: [new Date().valueOf()],
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      rate: [null, [Validators.required]],
      number: ['', [Validators.required]],
      createdDate: [this.datePipe.transform(new Date(), 'yyyy-MM-dd')],
    });
    this.route.paramMap.subscribe((params) => {
      if (params.get('id') != null) {
        this.customerId = params.get('id');
        this.getDataFromDB();
      }
    });
  }
  async getDataFromDB() {
    const docRef = doc(this.firbaseService.db, 'Customer/' + this.customerId);
    const docSnap = await getDoc(docRef);
    this.myForm.patchValue(docSnap.data());
  }
  async onSubmit(form: FormGroup) {
    if (!form.valid) {
      form.markAllAsTouched();
      return;
    }
    if (this.customerId == null) {
      setDoc(
        doc(
          this.firbaseService.db,
          'Customer',
          '' + this.myForm.value.customerId
        ),
        form.value
      ).then(() => {
        alert('Customer added successfully!');
        this.router.navigate(['/cust']);
      });
    } else {
      updateDoc(
        doc(this.firbaseService.db, 'Customer', '' + this.customerId),
        form.value
      ).then(() => {
        alert('Customer updated successfully!');
        this.router.navigate(['/cust']);
      });
    }
  }
}
