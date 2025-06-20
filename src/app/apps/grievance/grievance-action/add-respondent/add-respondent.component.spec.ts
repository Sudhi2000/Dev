import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRespondentComponent } from './add-respondent.component';

describe('AddRespondentComponent', () => {
  let component: AddRespondentComponent;
  let fixture: ComponentFixture<AddRespondentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRespondentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRespondentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
