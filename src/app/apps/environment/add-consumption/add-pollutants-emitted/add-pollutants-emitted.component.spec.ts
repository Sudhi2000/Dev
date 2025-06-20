import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPollutantsEmittedComponent } from './add-pollutants-emitted.component';

describe('AddPollutantsEmittedComponent', () => {
  let component: AddPollutantsEmittedComponent;
  let fixture: ComponentFixture<AddPollutantsEmittedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPollutantsEmittedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPollutantsEmittedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
