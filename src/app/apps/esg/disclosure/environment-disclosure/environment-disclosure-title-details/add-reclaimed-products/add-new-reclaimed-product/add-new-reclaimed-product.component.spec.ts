import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewReclaimedProductComponent } from './add-new-reclaimed-product.component';

describe('AddNewReclaimedProductComponent', () => {
  let component: AddNewReclaimedProductComponent;
  let fixture: ComponentFixture<AddNewReclaimedProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewReclaimedProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewReclaimedProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
