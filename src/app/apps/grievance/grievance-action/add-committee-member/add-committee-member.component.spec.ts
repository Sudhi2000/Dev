import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCommitteeMemberComponent } from './add-committee-member.component';

describe('AddCommitteeMemberComponent', () => {
  let component: AddCommitteeMemberComponent;
  let fixture: ComponentFixture<AddCommitteeMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCommitteeMemberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCommitteeMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
