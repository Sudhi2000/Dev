import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvironmentAssignedComponent } from './environment-assigned.component';

describe('EnvironmentAssignedComponent', () => {
  let component: EnvironmentAssignedComponent;
  let fixture: ComponentFixture<EnvironmentAssignedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnvironmentAssignedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvironmentAssignedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
