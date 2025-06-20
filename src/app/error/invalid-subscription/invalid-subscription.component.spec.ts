import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvalidSubscriptionComponent } from './invalid-subscription.component';

describe('InvalidSubscriptionComponent', () => {
  let component: InvalidSubscriptionComponent;
  let fixture: ComponentFixture<InvalidSubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvalidSubscriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvalidSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
