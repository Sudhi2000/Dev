import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmissionIntensityBaseComponent } from './add-emission-intensity-base.component';

describe('AddEmissionIntensityBaseComponent', () => {
  let component: AddEmissionIntensityBaseComponent;
  let fixture: ComponentFixture<AddEmissionIntensityBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEmissionIntensityBaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEmissionIntensityBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
