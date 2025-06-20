import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAccidentComponent } from './create-accident.component';

describe('CreateAccidentComponent', () => {
  let component: CreateAccidentComponent;
  let fixture: ComponentFixture<CreateAccidentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAccidentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAccidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
