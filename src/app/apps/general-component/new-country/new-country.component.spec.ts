import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCountryComponent } from './new-country.component';

describe('NewCountryComponent', () => {
  let component: NewCountryComponent;
  let fixture: ComponentFixture<NewCountryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewCountryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
