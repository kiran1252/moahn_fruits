import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodwiseBillingComponent } from './periodwise-billing.component';

describe('PeriodwiseBillingComponent', () => {
  let component: PeriodwiseBillingComponent;
  let fixture: ComponentFixture<PeriodwiseBillingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeriodwiseBillingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeriodwiseBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
