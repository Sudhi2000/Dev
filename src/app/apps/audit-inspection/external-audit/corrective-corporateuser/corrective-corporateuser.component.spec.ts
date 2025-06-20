import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrectiveCorporateuserComponent } from './corrective-corporateuser.component';

describe('CorrectiveCorporateuserComponent', () => {
  let component: CorrectiveCorporateuserComponent;
  let fixture: ComponentFixture<CorrectiveCorporateuserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorrectiveCorporateuserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrectiveCorporateuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
