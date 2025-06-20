import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditCalendarComponent } from './audit-calendar.component';

describe('AuditCalendarComponent', () => {
  let component: AuditCalendarComponent;
  let fixture: ComponentFixture<AuditCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditCalendarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
