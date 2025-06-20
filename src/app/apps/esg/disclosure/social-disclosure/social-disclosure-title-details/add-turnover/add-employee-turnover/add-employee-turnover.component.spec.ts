import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmployeeTurnoverComponent } from './add-employee-turnover.component';

describe('AddEmployeeTurnoverComponent', () => {
  let component: AddEmployeeTurnoverComponent;
  let fixture: ComponentFixture<AddEmployeeTurnoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEmployeeTurnoverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEmployeeTurnoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
