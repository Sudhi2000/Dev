import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDisclosureTeamMemberComponent } from './add-disclosure-team-member.component';

describe('AddDisclosureTeamMemberComponent', () => {
  let component: AddDisclosureTeamMemberComponent;
  let fixture: ComponentFixture<AddDisclosureTeamMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDisclosureTeamMemberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDisclosureTeamMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
