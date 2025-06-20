import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralDisclosureRegisterComponent } from './general-disclosure-register.component';

describe('GeneralDisclosureRegisterComponent', () => {
  let component: GeneralDisclosureRegisterComponent;
  let fixture: ComponentFixture<GeneralDisclosureRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralDisclosureRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralDisclosureRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
