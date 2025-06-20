import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWasteTypeComponent } from './create-waste-type.component';

describe('CreateWasteTypeComponent', () => {
  let component: CreateWasteTypeComponent;
  let fixture: ComponentFixture<CreateWasteTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateWasteTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateWasteTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
