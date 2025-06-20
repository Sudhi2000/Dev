import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthenticationOtpComponent } from './authentication-otp.component';

describe('AuthenticationOtpComponent', () => {
  let component: AuthenticationOtpComponent;
  let fixture: ComponentFixture<AuthenticationOtpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthenticationOtpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthenticationOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
