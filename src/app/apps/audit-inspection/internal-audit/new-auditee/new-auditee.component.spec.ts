import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAuditeeComponent } from './new-auditee.component';

describe('NewAuditeeComponent', () => {
  let component: NewAuditeeComponent;
  let fixture: ComponentFixture<NewAuditeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewAuditeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAuditeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
