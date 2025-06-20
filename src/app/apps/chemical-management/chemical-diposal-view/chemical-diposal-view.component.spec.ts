import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChemicalDiposalViewComponent } from './chemical-diposal-view.component';

describe('ChemicalDiposalViewComponent', () => {
  let component: ChemicalDiposalViewComponent;
  let fixture: ComponentFixture<ChemicalDiposalViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChemicalDiposalViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChemicalDiposalViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
