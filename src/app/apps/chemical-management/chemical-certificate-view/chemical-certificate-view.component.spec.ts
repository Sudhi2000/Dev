import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChemicalCertificateViewComponent } from './chemical-certificate-view.component';

describe('ChemicalCertificateViewComponent', () => {
  let component: ChemicalCertificateViewComponent;
  let fixture: ComponentFixture<ChemicalCertificateViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChemicalCertificateViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChemicalCertificateViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
