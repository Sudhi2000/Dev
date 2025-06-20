import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPpeComponent } from './new-ppe.component';

describe('NewPpeComponent', () => {
  let component: NewPpeComponent;
  let fixture: ComponentFixture<NewPpeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPpeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPpeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
