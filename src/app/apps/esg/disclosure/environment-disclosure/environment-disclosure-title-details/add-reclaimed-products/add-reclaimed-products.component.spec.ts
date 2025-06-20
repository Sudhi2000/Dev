import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReclaimedProductsComponent } from './add-reclaimed-products.component';

describe('AddReclaimedProductsComponent', () => {
  let component: AddReclaimedProductsComponent;
  let fixture: ComponentFixture<AddReclaimedProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddReclaimedProductsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddReclaimedProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
