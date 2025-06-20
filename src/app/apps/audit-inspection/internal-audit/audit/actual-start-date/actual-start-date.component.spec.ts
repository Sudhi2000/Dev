import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualStartDateComponent } from './actual-start-date.component';

describe('ActualStartDateComponent', () => {
  let component: ActualStartDateComponent;
  let fixture: ComponentFixture<ActualStartDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActualStartDateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActualStartDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
