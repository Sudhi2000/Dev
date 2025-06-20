import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChemicalInventoryComponent } from './chemical-inventory.component';

describe('ChemicalInventoryComponent', () => {
  let component: ChemicalInventoryComponent;
  let fixture: ComponentFixture<ChemicalInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChemicalInventoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChemicalInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
