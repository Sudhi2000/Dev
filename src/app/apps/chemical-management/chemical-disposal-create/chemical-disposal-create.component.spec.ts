import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChemicalDisposalCreateComponent } from './chemical-disposal-create.component';

describe('ChemicalDisposalCreateComponent', () => {
  let component: ChemicalDisposalCreateComponent;
  let fixture: ComponentFixture<ChemicalDisposalCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChemicalDisposalCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChemicalDisposalCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
