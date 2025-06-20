import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWasteGeneratedComponent } from './add-waste-generated.component';

describe('AddWasteGeneratedComponent', () => {
  let component: AddWasteGeneratedComponent;
  let fixture: ComponentFixture<AddWasteGeneratedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddWasteGeneratedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWasteGeneratedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
