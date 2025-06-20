import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAuditFirmComponent } from './create-audit-firm.component';

describe('CreateAuditFirmComponent', () => {
  let component: CreateAuditFirmComponent;
  let fixture: ComponentFixture<CreateAuditFirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAuditFirmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAuditFirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
