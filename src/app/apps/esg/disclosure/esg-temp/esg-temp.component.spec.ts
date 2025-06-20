import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsgTempComponent } from './esg-temp.component';

describe('EsgTempComponent', () => {
  let component: EsgTempComponent;
  let fixture: ComponentFixture<EsgTempComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsgTempComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EsgTempComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
