import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChemicalTransactionCreateComponent } from './chemical-transaction-create.component';

describe('ChemicalTransactionCreateComponent', () => {
  let component: ChemicalTransactionCreateComponent;
  let fixture: ComponentFixture<ChemicalTransactionCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChemicalTransactionCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChemicalTransactionCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
