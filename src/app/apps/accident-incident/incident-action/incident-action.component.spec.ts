import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentActionComponent } from './incident-action.component';

describe('IncidentActionComponent', () => {
  let component: IncidentActionComponent;
  let fixture: ComponentFixture<IncidentActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
