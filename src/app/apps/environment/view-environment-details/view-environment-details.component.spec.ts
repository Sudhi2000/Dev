import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEnvironmentDetailsComponent } from './view-environment-details.component';

describe('ViewEnvironmentDetailsComponent', () => {
  let component: ViewEnvironmentDetailsComponent;
  let fixture: ComponentFixture<ViewEnvironmentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewEnvironmentDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEnvironmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
