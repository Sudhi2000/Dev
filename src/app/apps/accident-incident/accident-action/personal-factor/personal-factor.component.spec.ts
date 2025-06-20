import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalFactorComponent } from './personal-factor.component';

describe('PersonalFactorComponent', () => {
  let component: PersonalFactorComponent;
  let fixture: ComponentFixture<PersonalFactorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalFactorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalFactorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
