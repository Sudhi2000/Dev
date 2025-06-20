import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddModifyMemberComponent } from './add-modify-member.component';

describe('AddModifyMemberComponent', () => {
  let component: AddModifyMemberComponent;
  let fixture: ComponentFixture<AddModifyMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddModifyMemberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddModifyMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
