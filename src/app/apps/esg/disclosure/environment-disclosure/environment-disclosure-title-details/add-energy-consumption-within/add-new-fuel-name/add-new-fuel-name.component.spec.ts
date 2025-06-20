import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewFuelNameComponent } from './add-new-fuel-name.component';

describe('AddNewFuelNameComponent', () => {
  let component: AddNewFuelNameComponent;
  let fixture: ComponentFixture<AddNewFuelNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewFuelNameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewFuelNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
