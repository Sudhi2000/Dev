import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefrigerantComponent } from './refrigerant.component';

describe('RefrigerantComponent', () => {
  let component: RefrigerantComponent;
  let fixture: ComponentFixture<RefrigerantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RefrigerantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RefrigerantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
