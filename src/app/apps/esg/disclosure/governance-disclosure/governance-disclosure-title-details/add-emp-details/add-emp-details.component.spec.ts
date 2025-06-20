import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmpDetailsComponent } from './add-emp-details.component';

describe('AddEmpDetailsComponent', () => {
  let component: AddEmpDetailsComponent;
  let fixture: ComponentFixture<AddEmpDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEmpDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEmpDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
