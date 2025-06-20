import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyCategoryComponent } from './survey-category.component';

describe('SurveyCategoryComponent', () => {
  let component: SurveyCategoryComponent;
  let fixture: ComponentFixture<SurveyCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SurveyCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
