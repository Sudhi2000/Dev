import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewTypeOfWasteComponent } from './add-new-type-of-waste.component';

describe('AddNewTypeOfWasteComponent', () => {
  let component: AddNewTypeOfWasteComponent;
  let fixture: ComponentFixture<AddNewTypeOfWasteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewTypeOfWasteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewTypeOfWasteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
