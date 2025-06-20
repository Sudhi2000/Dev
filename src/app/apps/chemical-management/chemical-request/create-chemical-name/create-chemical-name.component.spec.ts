import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateChemicalNameComponent } from './create-chemical-name.component';

describe('CreateChemicalNameComponent', () => {
  let component: CreateChemicalNameComponent;
  let fixture: ComponentFixture<CreateChemicalNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateChemicalNameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateChemicalNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
