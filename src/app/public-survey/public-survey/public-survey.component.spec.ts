import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicSurveyComponent } from './public-survey.component';

describe('PublicSurveyComponent', () => {
  let component: PublicSurveyComponent;
  let fixture: ComponentFixture<PublicSurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicSurveyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
