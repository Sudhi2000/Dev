import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBreachesOfCustomerPrivacyLossOfDataComponent } from './add-breaches-of-customer-privacy-loss-of-data.component';

describe('AddBreachesOfCustomerPrivacyLossOfDataComponent', () => {
  let component: AddBreachesOfCustomerPrivacyLossOfDataComponent;
  let fixture: ComponentFixture<AddBreachesOfCustomerPrivacyLossOfDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBreachesOfCustomerPrivacyLossOfDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBreachesOfCustomerPrivacyLossOfDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
