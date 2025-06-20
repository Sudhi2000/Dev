import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTertiaryPartComponent } from './create-tertiary-part.component';

describe('CreateTertiaryPartComponent', () => {
  let component: CreateTertiaryPartComponent;
  let fixture: ComponentFixture<CreateTertiaryPartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTertiaryPartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTertiaryPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
