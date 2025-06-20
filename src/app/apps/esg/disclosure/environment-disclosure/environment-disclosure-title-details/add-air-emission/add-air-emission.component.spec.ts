import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAirEmissionComponent } from './add-air-emission.component';

describe('AddAirEmissionComponent', () => {
  let component: AddAirEmissionComponent;
  let fixture: ComponentFixture<AddAirEmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAirEmissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAirEmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
