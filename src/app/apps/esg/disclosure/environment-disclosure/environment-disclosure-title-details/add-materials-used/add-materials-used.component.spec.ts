import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMaterialsUsedComponent } from './add-materials-used.component';

describe('AddMaterialsUsedComponent', () => {
  let component: AddMaterialsUsedComponent;
  let fixture: ComponentFixture<AddMaterialsUsedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMaterialsUsedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMaterialsUsedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
