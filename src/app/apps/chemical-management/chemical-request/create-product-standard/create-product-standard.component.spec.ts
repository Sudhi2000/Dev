import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProductStandardComponent } from './create-product-standard.component';

describe('CreateProductStandardComponent', () => {
  let component: CreateProductStandardComponent;
  let fixture: ComponentFixture<CreateProductStandardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateProductStandardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProductStandardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
