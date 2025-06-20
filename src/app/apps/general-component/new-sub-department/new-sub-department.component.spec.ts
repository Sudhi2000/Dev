import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSubDepartmentComponent } from './new-sub-department.component';

describe('NewSubDepartmentComponent', () => {
  let component: NewSubDepartmentComponent;
  let fixture: ComponentFixture<NewSubDepartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewSubDepartmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSubDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
