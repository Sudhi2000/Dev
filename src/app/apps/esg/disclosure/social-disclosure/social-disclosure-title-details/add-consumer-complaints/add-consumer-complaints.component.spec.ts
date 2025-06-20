import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddConsumerComplaintsComponent } from './add-consumer-complaints.component';

describe('AddConsumerComplaintsComponent', () => {
  let component: AddConsumerComplaintsComponent;
  let fixture: ComponentFixture<AddConsumerComplaintsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddConsumerComplaintsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddConsumerComplaintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
