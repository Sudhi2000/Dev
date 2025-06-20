import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateQuestionComponent } from './create-update-question.component';

describe('CreateUpdateQuestionComponent', () => {
  let component: CreateUpdateQuestionComponent;
  let fixture: ComponentFixture<CreateUpdateQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateUpdateQuestionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUpdateQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
