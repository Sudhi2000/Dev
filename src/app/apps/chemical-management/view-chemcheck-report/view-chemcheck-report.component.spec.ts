import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewChemcheckReportComponent } from './view-chemcheck-report.component';

describe('ViewChemcheckReportComponent', () => {
  let component: ViewChemcheckReportComponent;
  let fixture: ComponentFixture<ViewChemcheckReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewChemcheckReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewChemcheckReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
