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
  dailyExpenceId: any = null;
  filterDate: any = new Date();
  todaysDate: any = new Date();
  ngOnInit(): void {
    this.todaysDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.myForm = this.fb.group({
      dailyExpenceId: [new Date().valueOf()],
      name: ['', [Validators.required]],
      type: ['cash', [Validators.required]],
      amount: [null, [Validators.required]],
      month: [this.getCurrentMoth(this.filterDate)],
      createdDate: [this.datePipe.transform(new Date(), 'yyyy-MM-dd')],
      currentDate:[this.datePipe.transform(new Date(), 'yyyy-MM-dd'), [Validators.required]],
      entryTimestampDate: [new Date(this.todaysDate).getTime()]
    });
    this.route.paramMap.subscribe((params) => {
      if (params.get('id') != null) {
        this.dailyExpenceId = params.get('id');
        this.getDataFromDB();
      }
    });
  }
  async getDataFromDB() {
    const docRef = doc(this.firbaseService.db, 'dailyExpence/' + this.dailyExpenceId);
    const docSnap = await getDoc(docRef);
    this.myForm.patchValue(docSnap.data());
  }
  async onSubmit(form: FormGroup) {
    if (!form.valid) {
      form.markAllAsTouched();
      return;
    }
    this.myForm.value.entryTimestampDate = new Date(this.myForm.value.currentDate).getTime()
    if (this.dailyExpenceId == null) {
      setDoc(
        doc(
          this.firbaseService.db,
          'dailyExpence',
          '' + this.myForm.value.dailyExpenceId
        ),
        form.value
      ).then(() => {
        alert('Daily expence added successfully!');
        this.router.navigate(['/cust']);
      });
    } else {
      updateDoc(
        doc(this.firbaseService.db, 'dailyExpence', '' + this.dailyExpenceId),
        form.value
      ).then(() => {
        alert('Daily expence updated successfully!');
        this.router.navigate(['/cust']);
      });
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
}
