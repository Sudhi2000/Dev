import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyEndComponent } from './survey-end.component';

describe('SurveyEndComponent', () => {
  let component: SurveyEndComponent;
  let fixture: ComponentFixture<SurveyEndComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SurveyEndComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyEndComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
