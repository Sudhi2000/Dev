import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccidentActionComponent } from './accident-action.component';

describe('AccidentActionComponent', () => {
  let component: AccidentActionComponent;
  let fixture: ComponentFixture<AccidentActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccidentActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccidentActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
