import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyQueueComponent } from './pharmacy-queue.component';

describe('PharmacyQueueComponent', () => {
  let component: PharmacyQueueComponent;
  let fixture: ComponentFixture<PharmacyQueueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PharmacyQueueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmacyQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
