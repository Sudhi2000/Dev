import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyGrievanceComponent } from './modify-grievance.component';

describe('ModifyGrievanceComponent', () => {
  let component: ModifyGrievanceComponent;
  let fixture: ComponentFixture<ModifyGrievanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyGrievanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyGrievanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
