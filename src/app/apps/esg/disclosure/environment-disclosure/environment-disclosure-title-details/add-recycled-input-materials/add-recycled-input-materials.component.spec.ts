import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRecycledInputMaterialsComponent } from './add-recycled-input-materials.component';

describe('AddRecycledInputMaterialsComponent', () => {
  let component: AddRecycledInputMaterialsComponent;
  let fixture: ComponentFixture<AddRecycledInputMaterialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRecycledInputMaterialsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRecycledInputMaterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
