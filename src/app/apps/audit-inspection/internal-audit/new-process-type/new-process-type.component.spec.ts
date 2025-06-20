import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProcessTypeComponent } from './new-process-type.component';

describe('NewProcessTypeComponent', () => {
  let component: NewProcessTypeComponent;
  let fixture: ComponentFixture<NewProcessTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewProcessTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewProcessTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
