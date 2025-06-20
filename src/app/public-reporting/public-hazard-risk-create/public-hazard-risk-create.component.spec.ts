import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicHazardRiskCreateComponent } from './public-hazard-risk-create.component';

describe('PublicHazardRiskCreateComponent', () => {
  let component: PublicHazardRiskCreateComponent;
  let fixture: ComponentFixture<PublicHazardRiskCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicHazardRiskCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicHazardRiskCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
