import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTypeHrViolationsComponent } from './new-type-hr-violations.component';

describe('NewTypeHrViolationsComponent', () => {
  let component: NewTypeHrViolationsComponent;
  let fixture: ComponentFixture<NewTypeHrViolationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewTypeHrViolationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTypeHrViolationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
