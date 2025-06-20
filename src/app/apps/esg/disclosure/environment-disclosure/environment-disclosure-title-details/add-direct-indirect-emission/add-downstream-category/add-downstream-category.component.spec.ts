import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDownstreamCategoryComponent } from './add-downstream-category.component';

describe('AddDownstreamCategoryComponent', () => {
  let component: AddDownstreamCategoryComponent;
  let fixture: ComponentFixture<AddDownstreamCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDownstreamCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDownstreamCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
