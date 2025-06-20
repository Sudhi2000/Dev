import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRightsOfIndigenousPeopleComponent } from './add-rights-of-indigenous-people.component';

describe('AddRightsOfIndigenousPeopleComponent', () => {
  let component: AddRightsOfIndigenousPeopleComponent;
  let fixture: ComponentFixture<AddRightsOfIndigenousPeopleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRightsOfIndigenousPeopleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRightsOfIndigenousPeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
