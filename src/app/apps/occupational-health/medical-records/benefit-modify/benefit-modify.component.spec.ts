import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BenefitModifyComponent } from './benefit-modify.component';

describe('BenefitModifyComponent', () => {
  let component: BenefitModifyComponent;
  let fixture: ComponentFixture<BenefitModifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BenefitModifyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BenefitModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
