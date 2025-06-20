import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvironmentActionComponent } from './environment-action.component';

describe('EnvironmentActionComponent', () => {
  let component: EnvironmentActionComponent;
  let fixture: ComponentFixture<EnvironmentActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnvironmentActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvironmentActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
