import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentModifyComponent } from './incident-modify.component';

describe('IncidentModifyComponent', () => {
  let component: IncidentModifyComponent;
  let fixture: ComponentFixture<IncidentModifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentModifyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
