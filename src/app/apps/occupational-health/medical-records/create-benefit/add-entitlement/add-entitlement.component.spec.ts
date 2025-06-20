import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEntitlementComponent } from './add-entitlement.component';

describe('AddEntitlementComponent', () => {
  let component: AddEntitlementComponent;
  let fixture: ComponentFixture<AddEntitlementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEntitlementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEntitlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
