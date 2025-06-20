import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateEntitlementComponent } from './update-entitlement.component';

describe('UpdateEntitlementComponent', () => {
  let component: UpdateEntitlementComponent;
  let fixture: ComponentFixture<UpdateEntitlementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateEntitlementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateEntitlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
