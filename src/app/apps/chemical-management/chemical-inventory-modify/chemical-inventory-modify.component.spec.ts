import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChemicalInventoryModifyComponent } from './chemical-inventory-modify.component';

describe('ChemicalInventoryModifyComponent', () => {
  let component: ChemicalInventoryModifyComponent;
  let fixture: ComponentFixture<ChemicalInventoryModifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChemicalInventoryModifyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChemicalInventoryModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
