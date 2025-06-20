import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrectiveActionRegisterComponent } from './corrective-action-register.component';

describe('CorrectiveActionRegisterComponent', () => {
  let component: CorrectiveActionRegisterComponent;
  let fixture: ComponentFixture<CorrectiveActionRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorrectiveActionRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrectiveActionRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
