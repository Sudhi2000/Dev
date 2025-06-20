import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRemunerationSalaryWagesComponent } from './add-remuneration-salary-wages.component';

describe('AddRemunerationSalaryWagesComponent', () => {
  let component: AddRemunerationSalaryWagesComponent;
  let fixture: ComponentFixture<AddRemunerationSalaryWagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRemunerationSalaryWagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRemunerationSalaryWagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
