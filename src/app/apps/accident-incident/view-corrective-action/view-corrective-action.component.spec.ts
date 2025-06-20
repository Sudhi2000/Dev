import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCorrectiveActionComponent } from './view-corrective-action.component';

describe('ViewCorrectiveActionComponent', () => {
  let component: ViewCorrectiveActionComponent;
  let fixture: ComponentFixture<ViewCorrectiveActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCorrectiveActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCorrectiveActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
