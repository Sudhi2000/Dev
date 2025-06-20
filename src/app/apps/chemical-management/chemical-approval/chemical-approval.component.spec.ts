import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChemicalApprovalComponent } from './chemical-approval.component';

describe('ChemicalApprovalComponent', () => {
  let component: ChemicalApprovalComponent;
  let fixture: ComponentFixture<ChemicalApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChemicalApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChemicalApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
