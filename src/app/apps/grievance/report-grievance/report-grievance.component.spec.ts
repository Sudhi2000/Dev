import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportGrievanceComponent } from './report-grievance.component';

describe('ReportGrievanceComponent', () => {
  let component: ReportGrievanceComponent;
  let fixture: ComponentFixture<ReportGrievanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportGrievanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportGrievanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
