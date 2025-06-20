import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChemicalEditCertificateComponent } from './chemical-edit-certificate.component';

describe('ChemicalEditCertificateComponent', () => {
  let component: ChemicalEditCertificateComponent;
  let fixture: ComponentFixture<ChemicalEditCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChemicalEditCertificateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChemicalEditCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
