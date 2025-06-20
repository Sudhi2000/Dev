import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPositiveComponent } from './new-positive.component';

describe('NewPositiveComponent', () => {
  let component: NewPositiveComponent;
  let fixture: ComponentFixture<NewPositiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPositiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPositiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
