import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentAssignedComponent } from './incident-assigned.component';

describe('IncidentAssignedComponent', () => {
  let component: IncidentAssignedComponent;
  let fixture: ComponentFixture<IncidentAssignedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentAssignedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentAssignedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
