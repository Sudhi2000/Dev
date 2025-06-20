import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyAuditeeComponent } from './modify-auditee.component';

describe('ModifyAuditeeComponent', () => {
  let component: ModifyAuditeeComponent;
  let fixture: ComponentFixture<ModifyAuditeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyAuditeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyAuditeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
