import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateProgressComponent } from './create-update-progress.component';

describe('CreateUpdateProgressComponent', () => {
  let component: CreateUpdateProgressComponent;
  let fixture: ComponentFixture<CreateUpdateProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateUpdateProgressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUpdateProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
