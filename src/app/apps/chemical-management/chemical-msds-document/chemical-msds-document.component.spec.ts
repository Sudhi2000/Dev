import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChemicalMsdsDocumentComponent } from './chemical-msds-document.component';

describe('ChemicalMsdsDocumentComponent', () => {
  let component: ChemicalMsdsDocumentComponent;
  let fixture: ComponentFixture<ChemicalMsdsDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChemicalMsdsDocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChemicalMsdsDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
