import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewManufacturerComponent } from './new-manufacturer.component';

describe('NewManufacturerComponent', () => {
  let component: NewManufacturerComponent;
  let fixture: ComponentFixture<NewManufacturerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewManufacturerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewManufacturerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
