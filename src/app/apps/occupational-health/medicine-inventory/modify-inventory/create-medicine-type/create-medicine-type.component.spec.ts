import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMedicineTypeComponent } from './create-medicine-type.component';

describe('CreateMedicineTypeComponent', () => {
  let component: CreateMedicineTypeComponent;
  let fixture: ComponentFixture<CreateMedicineTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateMedicineTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMedicineTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
