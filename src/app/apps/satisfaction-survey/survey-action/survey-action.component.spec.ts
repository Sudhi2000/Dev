import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyActionComponent } from './survey-action.component';

describe('SurveyActionComponent', () => {
  let component: SurveyActionComponent;
  let fixture: ComponentFixture<SurveyActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SurveyActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
