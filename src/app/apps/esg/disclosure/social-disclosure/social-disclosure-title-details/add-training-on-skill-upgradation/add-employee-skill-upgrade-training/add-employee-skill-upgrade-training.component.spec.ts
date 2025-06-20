import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmployeeSkillUpgradeTrainingComponent } from './add-employee-skill-upgrade-training.component';

describe('AddEmployeeSkillUpgradeTrainingComponent', () => {
  let component: AddEmployeeSkillUpgradeTrainingComponent;
  let fixture: ComponentFixture<AddEmployeeSkillUpgradeTrainingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEmployeeSkillUpgradeTrainingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEmployeeSkillUpgradeTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
