import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNonDiscriminationComponent } from './add-non-discrimination.component';

describe('AddNonDiscriminationComponent', () => {
  let component: AddNonDiscriminationComponent;
  let fixture: ComponentFixture<AddNonDiscriminationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNonDiscriminationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNonDiscriminationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
