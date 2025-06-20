import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewParticipantComponent } from './view-participant.component';

describe('ViewParticipantComponent', () => {
  let component: ViewParticipantComponent;
  let fixture: ComponentFixture<ViewParticipantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewParticipantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewParticipantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
