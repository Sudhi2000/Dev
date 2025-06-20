import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChemicalViewCertificateComponent } from './chemical-view-certificate.component';

describe('ChemicalViewCertificateComponent', () => {
  let component: ChemicalViewCertificateComponent;
  let fixture: ComponentFixture<ChemicalViewCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChemicalViewCertificateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChemicalViewCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
