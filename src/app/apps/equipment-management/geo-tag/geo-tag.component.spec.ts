import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeoTagComponent } from './geo-tag.component';

describe('GeoTagComponent', () => {
  let component: GeoTagComponent;
  let fixture: ComponentFixture<GeoTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeoTagComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeoTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
