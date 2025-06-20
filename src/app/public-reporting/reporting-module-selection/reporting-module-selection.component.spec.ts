import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportingModuleSelectionComponent } from './reporting-module-selection.component';

describe('ReportingModuleSelectionComponent', () => {
  let component: ReportingModuleSelectionComponent;
  let fixture: ComponentFixture<ReportingModuleSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportingModuleSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportingModuleSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
