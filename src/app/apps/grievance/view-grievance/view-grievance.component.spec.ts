import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGrievanceComponent } from './view-grievance.component';

describe('ViewGrievanceComponent', () => {
  let component: ViewGrievanceComponent;
  let fixture: ComponentFixture<ViewGrievanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewGrievanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewGrievanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
