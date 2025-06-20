import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddImpactOfActivitiesComponent } from './add-impact-of-activities.component';

describe('AddImpactOfActivitiesComponent', () => {
  let component: AddImpactOfActivitiesComponent;
  let fixture: ComponentFixture<AddImpactOfActivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddImpactOfActivitiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddImpactOfActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
