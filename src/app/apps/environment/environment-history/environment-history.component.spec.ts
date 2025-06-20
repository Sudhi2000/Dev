import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvironmentHistoryComponent } from './environment-history.component';

describe('EnvironmentHistoryComponent', () => {
  let component: EnvironmentHistoryComponent;
  let fixture: ComponentFixture<EnvironmentHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnvironmentHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvironmentHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
