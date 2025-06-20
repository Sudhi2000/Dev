import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyActionComponent } from './pharmacy-action.component';

describe('PharmacyActionComponent', () => {
  let component: PharmacyActionComponent;
  let fixture: ComponentFixture<PharmacyActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PharmacyActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmacyActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
