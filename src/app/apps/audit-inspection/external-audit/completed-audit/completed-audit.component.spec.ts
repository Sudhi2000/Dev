import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedAuditComponent } from './completed-audit.component';

describe('CompletedAuditComponent', () => {
  let component: CompletedAuditComponent;
  let fixture: ComponentFixture<CompletedAuditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompletedAuditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletedAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
