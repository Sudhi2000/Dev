import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobFactorComponent } from './job-factor.component';

describe('JobFactorComponent', () => {
  let component: JobFactorComponent;
  let fixture: ComponentFixture<JobFactorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobFactorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobFactorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
