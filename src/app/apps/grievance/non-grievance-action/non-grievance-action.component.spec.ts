import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonGrievanceActionComponent } from './non-grievance-action.component';

describe('NonGrievanceActionComponent', () => {
  let component: NonGrievanceActionComponent;
  let fixture: ComponentFixture<NonGrievanceActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonGrievanceActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NonGrievanceActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
