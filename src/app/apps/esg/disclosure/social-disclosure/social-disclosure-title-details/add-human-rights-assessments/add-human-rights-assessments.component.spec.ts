import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHumanRightsAssessmentsComponent } from './add-human-rights-assessments.component';

describe('AddHumanRightsAssessmentsComponent', () => {
  let component: AddHumanRightsAssessmentsComponent;
  let fixture: ComponentFixture<AddHumanRightsAssessmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddHumanRightsAssessmentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHumanRightsAssessmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
