import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FirbaseService } from '../firbase.service';
import { collection, getDocs, query, where } from 'firebase/firestore/lite';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  myForm: any;
  constructor(
    private fb: FormBuilder,
    private firbaseService: FirbaseService,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    var isAuthenticated = localStorage.getItem('isLoggedIn');
    if (isAuthenticated) {
      this.router.navigate(['home']);
    }
    this.myForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  async onSubmit(form: FormGroup) {
    debugger;
    if (!form.valid) {
      form.markAllAsTouched();
      return;
    }
    var colData = collection(this.firbaseService.db, 'users');
    const q = query(
      colData,
      where('userName', '==', form.value.userName.toLocaleLowerCase()),
      where('password', '==', form.value.password)
    );
    const data = await getDocs(q);
    var loginDta = data.docs.map((doc) => doc.data());
    if (loginDta.length > 0) {
      localStorage.setItem('isLoggedIn', 'true');
      this.router.navigate(['home']);
      setTimeout(() => {
        location.reload();
    }, 1000);
    } else {
      alert('Invalid credentials');
    }
  }
}
