import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSymptomComponent } from './create-symptom.component';

describe('CreateSymptomComponent', () => {
  let component: CreateSymptomComponent;
  let fixture: ComponentFixture<CreateSymptomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateSymptomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSymptomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
