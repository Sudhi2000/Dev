import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTypeOfOdsComponent } from './new-type-of-ods.component';

describe('NewTypeOfOdsComponent', () => {
  let component: NewTypeOfOdsComponent;
  let fixture: ComponentFixture<NewTypeOfOdsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewTypeOfOdsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTypeOfOdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
