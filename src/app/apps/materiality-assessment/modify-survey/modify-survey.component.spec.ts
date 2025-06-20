import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifySurveyComponent } from './modify-survey.component';

describe('ModifySurveyComponent', () => {
  let component: ModifySurveyComponent;
  let fixture: ComponentFixture<ModifySurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifySurveyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifySurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
