import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewProductCategoryComponent } from './add-new-product-category.component';

describe('AddNewProductCategoryComponent', () => {
  let component: AddNewProductCategoryComponent;
  let fixture: ComponentFixture<AddNewProductCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewProductCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewProductCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
