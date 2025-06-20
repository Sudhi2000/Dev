import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrectiveActionComponent } from './corrective-action.component';

describe('CorrectiveActionComponent', () => {
  let component: CorrectiveActionComponent;
  let fixture: ComponentFixture<CorrectiveActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorrectiveActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrectiveActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
