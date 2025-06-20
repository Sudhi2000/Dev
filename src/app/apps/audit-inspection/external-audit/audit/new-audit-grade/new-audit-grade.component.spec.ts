import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAuditGradeComponent } from './new-audit-grade.component';

describe('NewAuditGradeComponent', () => {
  let component: NewAuditGradeComponent;
  let fixture: ComponentFixture<NewAuditGradeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewAuditGradeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAuditGradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
