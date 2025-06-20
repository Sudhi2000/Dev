import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChemicalTransactionComponent } from './chemical-transaction.component';

describe('ChemicalTransactionComponent', () => {
  let component: ChemicalTransactionComponent;
  let fixture: ComponentFixture<ChemicalTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChemicalTransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChemicalTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
