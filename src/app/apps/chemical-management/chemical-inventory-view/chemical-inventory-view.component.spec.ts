import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChemicalInventoryViewComponent } from './chemical-inventory-view.component';

describe('ChemicalInventoryViewComponent', () => {
  let component: ChemicalInventoryViewComponent;
  let fixture: ComponentFixture<ChemicalInventoryViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChemicalInventoryViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChemicalInventoryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
