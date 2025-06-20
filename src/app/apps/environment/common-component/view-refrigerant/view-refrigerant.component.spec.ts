import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRefrigerantComponent } from './view-refrigerant.component';

describe('ViewRefrigerantComponent', () => {
  let component: ViewRefrigerantComponent;
  let fixture: ComponentFixture<ViewRefrigerantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewRefrigerantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRefrigerantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
