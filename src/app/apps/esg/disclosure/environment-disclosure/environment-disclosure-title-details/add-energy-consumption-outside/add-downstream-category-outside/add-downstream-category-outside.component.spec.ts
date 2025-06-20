import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDownstreamCategoryOutsideComponent } from './add-downstream-category-outside.component';

describe('AddDownstreamCategoryOutsideComponent', () => {
  let component: AddDownstreamCategoryOutsideComponent;
  let fixture: ComponentFixture<AddDownstreamCategoryOutsideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDownstreamCategoryOutsideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDownstreamCategoryOutsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
