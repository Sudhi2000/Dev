import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccidentModifyComponent } from './accident-modify.component';

describe('AccidentModifyComponent', () => {
  let component: AccidentModifyComponent;
  let fixture: ComponentFixture<AccidentModifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccidentModifyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccidentModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
