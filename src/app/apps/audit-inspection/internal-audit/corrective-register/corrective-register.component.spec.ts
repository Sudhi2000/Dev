import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrectiveRegisterComponent } from './corrective-register.component';

describe('CorrectiveRegisterComponent', () => {
  let component: CorrectiveRegisterComponent;
  let fixture: ComponentFixture<CorrectiveRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorrectiveRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrectiveRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
