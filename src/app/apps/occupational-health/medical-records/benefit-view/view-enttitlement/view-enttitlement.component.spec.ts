import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEnttitlementComponent } from './view-enttitlement.component';

describe('ViewEnttitlementComponent', () => {
  let component: ViewEnttitlementComponent;
  let fixture: ComponentFixture<ViewEnttitlementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewEnttitlementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEnttitlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
