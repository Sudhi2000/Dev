import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBPDetailsComponent } from './add-bp-details.component';

describe('AddBPDetailsComponent', () => {
  let component: AddBPDetailsComponent;
  let fixture: ComponentFixture<AddBPDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBPDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBPDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
