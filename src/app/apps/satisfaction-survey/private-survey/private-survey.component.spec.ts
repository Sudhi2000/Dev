import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateSurveyComponent } from './private-survey.component';

describe('PrivateSurveyComponent', () => {
  let component: PrivateSurveyComponent;
  let fixture: ComponentFixture<PrivateSurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivateSurveyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivateSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
