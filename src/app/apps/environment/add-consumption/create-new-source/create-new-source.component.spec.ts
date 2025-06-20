import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewSourceComponent } from './create-new-source.component';

describe('CreateNewSourceComponent', () => {
  let component: CreateNewSourceComponent;
  let fixture: ComponentFixture<CreateNewSourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateNewSourceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
