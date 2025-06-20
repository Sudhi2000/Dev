import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoReconsultationComponent } from './no-reconsultation.component';

describe('NoReconsultationComponent', () => {
  let component: NoReconsultationComponent;
  let fixture: ComponentFixture<NoReconsultationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoReconsultationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoReconsultationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
