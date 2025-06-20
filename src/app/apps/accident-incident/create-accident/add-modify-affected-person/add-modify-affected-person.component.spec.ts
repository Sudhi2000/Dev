import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddModifyAffectedPersonComponent } from './add-modify-affected-person.component';

describe('AddModifyAffectedPersonComponent', () => {
  let component: AddModifyAffectedPersonComponent;
  let fixture: ComponentFixture<AddModifyAffectedPersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddModifyAffectedPersonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddModifyAffectedPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
