import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDisposeComponent } from './create-dispose.component';

describe('CreateDisposeComponent', () => {
  let component: CreateDisposeComponent;
  let fixture: ComponentFixture<CreateDisposeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateDisposeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDisposeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
