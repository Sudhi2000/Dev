import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAuditorComponent } from './add-auditor.component';

describe('AddAuditorComponent', () => {
  let component: AddAuditorComponent;
  let fixture: ComponentFixture<AddAuditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAuditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAuditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
