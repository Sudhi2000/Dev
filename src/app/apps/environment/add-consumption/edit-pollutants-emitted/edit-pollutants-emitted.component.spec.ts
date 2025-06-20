import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPollutantsEmittedComponent } from './edit-pollutants-emitted.component';

describe('EditPollutantsEmittedComponent', () => {
  let component: EditPollutantsEmittedComponent;
  let fixture: ComponentFixture<EditPollutantsEmittedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPollutantsEmittedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPollutantsEmittedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
