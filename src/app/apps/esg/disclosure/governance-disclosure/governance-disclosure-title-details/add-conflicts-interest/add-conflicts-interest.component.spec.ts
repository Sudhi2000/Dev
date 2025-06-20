import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddConflictsInterestComponent } from './add-conflicts-interest.component';

describe('AddConflictsInterestComponent', () => {
  let component: AddConflictsInterestComponent;
  let fixture: ComponentFixture<AddConflictsInterestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddConflictsInterestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddConflictsInterestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
