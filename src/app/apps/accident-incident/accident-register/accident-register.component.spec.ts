import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccidentRegisterComponent } from './accident-register.component';

describe('AccidentRegisterComponent', () => {
  let component: AccidentRegisterComponent;
  let fixture: ComponentFixture<AccidentRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccidentRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccidentRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
