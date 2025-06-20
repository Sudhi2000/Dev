import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSpeciesAffectedComponent } from './add-species-affected.component';

describe('AddSpeciesAffectedComponent', () => {
  let component: AddSpeciesAffectedComponent;
  let fixture: ComponentFixture<AddSpeciesAffectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSpeciesAffectedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSpeciesAffectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
