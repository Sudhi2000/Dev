import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPossibleCategoryComponent } from './new-possible-category.component';

describe('NewPossibleCategoryComponent', () => {
  let component: NewPossibleCategoryComponent;
  let fixture: ComponentFixture<NewPossibleCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPossibleCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPossibleCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
