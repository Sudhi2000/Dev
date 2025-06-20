import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWorkersSkillUpgradeTrainingComponent } from './add-workers-skill-upgrade-training.component';

describe('AddWorkersSkillUpgradeTrainingComponent', () => {
  let component: AddWorkersSkillUpgradeTrainingComponent;
  let fixture: ComponentFixture<AddWorkersSkillUpgradeTrainingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddWorkersSkillUpgradeTrainingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWorkersSkillUpgradeTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
