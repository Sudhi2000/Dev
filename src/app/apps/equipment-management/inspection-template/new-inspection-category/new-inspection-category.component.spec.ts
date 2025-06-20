import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewInspectionCategoryComponent } from './new-inspection-category.component';

describe('NewInspectionCategoryComponent', () => {
  let component: NewInspectionCategoryComponent;
  let fixture: ComponentFixture<NewInspectionCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewInspectionCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewInspectionCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
