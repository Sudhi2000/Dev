import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLegalAdvisorComponent } from './add-legal-advisor.component';

describe('AddLegalAdvisorComponent', () => {
  let component: AddLegalAdvisorComponent;
  let fixture: ComponentFixture<AddLegalAdvisorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLegalAdvisorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLegalAdvisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
