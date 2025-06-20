import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGeoTagComponent } from './view-geo-tag.component';

describe('ViewGeoTagComponent', () => {
  let component: ViewGeoTagComponent;
  let fixture: ComponentFixture<ViewGeoTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewGeoTagComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewGeoTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
