import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewNonGrievanceComponent } from './view-non-grievance.component';

describe('ViewNonGrievanceComponent', () => {
  let component: ViewNonGrievanceComponent;
  let fixture: ComponentFixture<ViewNonGrievanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewNonGrievanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewNonGrievanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
