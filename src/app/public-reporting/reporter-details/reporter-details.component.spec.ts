import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporterDetailsComponent } from './reporter-details.component';

describe('ReporterDetailsComponent', () => {
  let component: ReporterDetailsComponent;
  let fixture: ComponentFixture<ReporterDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporterDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporterDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
