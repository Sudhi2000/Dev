import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpstreamCategoryOutsideComponent } from './add-upstream-category-outside.component';

describe('AddUpstreamCategoryOutsideComponent', () => {
  let component: AddUpstreamCategoryOutsideComponent;
  let fixture: ComponentFixture<AddUpstreamCategoryOutsideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpstreamCategoryOutsideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpstreamCategoryOutsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
