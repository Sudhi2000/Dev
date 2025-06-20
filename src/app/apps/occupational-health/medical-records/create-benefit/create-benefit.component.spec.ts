import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBenefitComponent } from './create-benefit.component';

describe('CreateBenefitComponent', () => {
  let component: CreateBenefitComponent;
  let fixture: ComponentFixture<CreateBenefitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateBenefitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBenefitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
