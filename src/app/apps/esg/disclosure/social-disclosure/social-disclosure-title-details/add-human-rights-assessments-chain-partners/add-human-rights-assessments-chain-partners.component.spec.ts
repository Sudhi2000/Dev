import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHumanRightsAssessmentsChainPartnersComponent } from './add-human-rights-assessments-chain-partners.component';

describe('AddHumanRightsAssessmentsChainPartnersComponent', () => {
  let component: AddHumanRightsAssessmentsChainPartnersComponent;
  let fixture: ComponentFixture<AddHumanRightsAssessmentsChainPartnersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddHumanRightsAssessmentsChainPartnersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHumanRightsAssessmentsChainPartnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
