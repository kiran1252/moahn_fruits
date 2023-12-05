import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerWiseBillingComponent } from './customer-wise-billing.component';

describe('CustomerWiseBillingComponent', () => {
  let component: CustomerWiseBillingComponent;
  let fixture: ComponentFixture<CustomerWiseBillingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerWiseBillingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerWiseBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
