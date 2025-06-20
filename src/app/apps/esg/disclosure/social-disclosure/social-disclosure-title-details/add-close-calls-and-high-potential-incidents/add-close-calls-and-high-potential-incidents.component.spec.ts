import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCloseCallsAndHighPotentialIncidentsComponent } from './add-close-calls-and-high-potential-incidents.component';

describe('AddCloseCallsAndHighPotentialIncidentsComponent', () => {
  let component: AddCloseCallsAndHighPotentialIncidentsComponent;
  let fixture: ComponentFixture<AddCloseCallsAndHighPotentialIncidentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCloseCallsAndHighPotentialIncidentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCloseCallsAndHighPotentialIncidentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
