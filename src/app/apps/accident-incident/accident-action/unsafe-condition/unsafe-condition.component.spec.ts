import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsafeConditionComponent } from './unsafe-condition.component';

describe('UnsafeConditionComponent', () => {
  let component: UnsafeConditionComponent;
  let fixture: ComponentFixture<UnsafeConditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnsafeConditionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnsafeConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
