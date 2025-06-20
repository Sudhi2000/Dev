import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWasteGeneratedMultipleComponent } from './add-waste-generated-multiple.component';

describe('AddWasteGeneratedMultipleComponent', () => {
  let component: AddWasteGeneratedMultipleComponent;
  let fixture: ComponentFixture<AddWasteGeneratedMultipleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddWasteGeneratedMultipleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWasteGeneratedMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
