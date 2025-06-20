import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyTeamMemberComponent } from './modify-team-member.component';

describe('ModifyTeamMemberComponent', () => {
  let component: ModifyTeamMemberComponent;
  let fixture: ComponentFixture<ModifyTeamMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyTeamMemberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyTeamMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
