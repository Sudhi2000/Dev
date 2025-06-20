import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductRecallsComponent } from './add-product-recalls.component';

describe('AddProductRecallsComponent', () => {
  let component: AddProductRecallsComponent;
  let fixture: ComponentFixture<AddProductRecallsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProductRecallsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductRecallsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
