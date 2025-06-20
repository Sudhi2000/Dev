import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWitnessComponent } from './add-witness.component';

describe('AddWitnessComponent', () => {
  let component: AddWitnessComponent;
  let fixture: ComponentFixture<AddWitnessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddWitnessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWitnessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
