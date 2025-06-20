import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewInputMaterialComponent } from './add-new-input-material.component';

describe('AddNewInputMaterialComponent', () => {
  let component: AddNewInputMaterialComponent;
  let fixture: ComponentFixture<AddNewInputMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewInputMaterialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewInputMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
