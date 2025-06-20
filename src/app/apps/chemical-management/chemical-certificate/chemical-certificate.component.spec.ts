import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChemicalCertificateComponent } from './chemical-certificate.component';

describe('ChemicalCertificateComponent', () => {
  let component: ChemicalCertificateComponent;
  let fixture: ComponentFixture<ChemicalCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChemicalCertificateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChemicalCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
