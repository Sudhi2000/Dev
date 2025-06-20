import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BenefitViewComponent } from './benefit-view.component';

describe('BenefitViewComponent', () => {
  let component: BenefitViewComponent;
  let fixture: ComponentFixture<BenefitViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BenefitViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BenefitViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
