import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRatioSalaryRemunerationWomenMenComponent } from './add-ratio-salary-remuneration-women-men.component';

describe('AddRatioSalaryRemunerationWomenMenComponent', () => {
  let component: AddRatioSalaryRemunerationWomenMenComponent;
  let fixture: ComponentFixture<AddRatioSalaryRemunerationWomenMenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRatioSalaryRemunerationWomenMenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRatioSalaryRemunerationWomenMenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
