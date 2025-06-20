import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrievanceActionComponent } from './grievance-action.component';

describe('GrievanceActionComponent', () => {
  let component: GrievanceActionComponent;
  let fixture: ComponentFixture<GrievanceActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrievanceActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrievanceActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
