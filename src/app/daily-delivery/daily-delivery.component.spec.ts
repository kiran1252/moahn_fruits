import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyDeliveryComponent } from './daily-delivery.component';

describe('DailyDeliveryComponent', () => {
  let component: DailyDeliveryComponent;
  let fixture: ComponentFixture<DailyDeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyDeliveryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
