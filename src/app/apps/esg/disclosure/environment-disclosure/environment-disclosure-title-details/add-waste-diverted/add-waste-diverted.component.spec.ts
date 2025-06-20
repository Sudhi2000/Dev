import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWasteDivertedComponent } from './add-waste-diverted.component';

describe('AddWasteDivertedComponent', () => {
  let component: AddWasteDivertedComponent;
  let fixture: ComponentFixture<AddWasteDivertedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddWasteDivertedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWasteDivertedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
