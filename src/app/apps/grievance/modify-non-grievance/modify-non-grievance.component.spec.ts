import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyNonGrievanceComponent } from './modify-non-grievance.component';

describe('ModifyNonGrievanceComponent', () => {
  let component: ModifyNonGrievanceComponent;
  let fixture: ComponentFixture<ModifyNonGrievanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyNonGrievanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyNonGrievanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
