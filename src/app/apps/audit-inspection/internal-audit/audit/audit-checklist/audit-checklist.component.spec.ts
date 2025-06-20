import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditChecklistComponent } from './audit-checklist.component';

describe('AuditChecklistComponent', () => {
  let component: AuditChecklistComponent;
  let fixture: ComponentFixture<AuditChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditChecklistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
