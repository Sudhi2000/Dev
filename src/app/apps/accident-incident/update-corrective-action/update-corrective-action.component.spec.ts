import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCorrectiveActionComponent } from './update-corrective-action.component';

describe('UpdateCorrectiveActionComponent', () => {
  let component: UpdateCorrectiveActionComponent;
  let fixture: ComponentFixture<UpdateCorrectiveActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateCorrectiveActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCorrectiveActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
