import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewActionTakenComponent } from './view-action-taken.component';

describe('ViewActionTakenComponent', () => {
  let component: ViewActionTakenComponent;
  let fixture: ComponentFixture<ViewActionTakenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewActionTakenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewActionTakenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
