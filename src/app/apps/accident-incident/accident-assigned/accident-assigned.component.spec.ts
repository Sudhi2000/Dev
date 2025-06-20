import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccidentAssignedComponent } from './accident-assigned.component';

describe('AccidentAssignedComponent', () => {
  let component: AccidentAssignedComponent;
  let fixture: ComponentFixture<AccidentAssignedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccidentAssignedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccidentAssignedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
