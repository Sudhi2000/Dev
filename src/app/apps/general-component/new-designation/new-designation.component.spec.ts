import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDesignationComponent } from './new-designation.component';

describe('NewDesignationComponent', () => {
  let component: NewDesignationComponent;
  let fixture: ComponentFixture<NewDesignationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewDesignationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDesignationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
