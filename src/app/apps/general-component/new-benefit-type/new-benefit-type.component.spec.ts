import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBenefitTypeComponent } from './new-benefit-type.component';

describe('NewBenefitTypeComponent', () => {
  let component: NewBenefitTypeComponent;
  let fixture: ComponentFixture<NewBenefitTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewBenefitTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewBenefitTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
