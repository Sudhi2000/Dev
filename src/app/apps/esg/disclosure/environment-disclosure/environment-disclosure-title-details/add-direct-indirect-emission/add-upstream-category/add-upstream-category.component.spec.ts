import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpstreamCategoryComponent } from './add-upstream-category.component';

describe('AddUpstreamCategoryComponent', () => {
  let component: AddUpstreamCategoryComponent;
  let fixture: ComponentFixture<AddUpstreamCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpstreamCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpstreamCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
