import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditCalendarDetailsComponent } from './audit-calendar-details.component';

describe('AuditCalendarDetailsComponent', () => {
  let component: AuditCalendarDetailsComponent;
  let fixture: ComponentFixture<AuditCalendarDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditCalendarDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditCalendarDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
