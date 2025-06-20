import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoToBooleanComponent } from './go-to-boolean.component';

describe('GoToBooleanComponent', () => {
  let component: GoToBooleanComponent;
  let fixture: ComponentFixture<GoToBooleanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoToBooleanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoToBooleanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
