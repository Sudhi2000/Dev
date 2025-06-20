import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonConsultaionComponent } from './non-consultaion.component';

describe('NonConsultaionComponent', () => {
  let component: NonConsultaionComponent;
  let fixture: ComponentFixture<NonConsultaionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonConsultaionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NonConsultaionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
