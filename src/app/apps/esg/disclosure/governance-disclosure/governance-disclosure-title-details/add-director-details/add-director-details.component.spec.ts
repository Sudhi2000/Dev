import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDirectorDetailsComponent } from './add-director-details.component';

describe('AddDirectorDetailsComponent', () => {
  let component: AddDirectorDetailsComponent;
  let fixture: ComponentFixture<AddDirectorDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDirectorDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDirectorDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
