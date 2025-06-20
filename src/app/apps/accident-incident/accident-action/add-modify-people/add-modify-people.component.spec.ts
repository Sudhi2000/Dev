import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddModifyPeopleComponent } from './add-modify-people.component';

describe('AddModifyPeopleComponent', () => {
  let component: AddModifyPeopleComponent;
  let fixture: ComponentFixture<AddModifyPeopleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddModifyPeopleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddModifyPeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
