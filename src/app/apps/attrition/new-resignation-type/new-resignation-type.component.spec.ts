import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewResignationTypeComponent } from './new-resignation-type.component';

describe('NewResignationTypeComponent', () => {
  let component: NewResignationTypeComponent;
  let fixture: ComponentFixture<NewResignationTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewResignationTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewResignationTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
