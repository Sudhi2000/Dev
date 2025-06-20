import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsafeActsComponent } from './unsafe-acts.component';

describe('UnsafeActsComponent', () => {
  let component: UnsafeActsComponent;
  let fixture: ComponentFixture<UnsafeActsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnsafeActsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnsafeActsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
