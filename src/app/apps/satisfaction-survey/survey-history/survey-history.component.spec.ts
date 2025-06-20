import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyHistoryComponent } from './survey-history.component';

describe('SurveyHistoryComponent', () => {
  let component: SurveyHistoryComponent;
  let fixture: ComponentFixture<SurveyHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SurveyHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
