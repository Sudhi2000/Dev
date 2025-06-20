import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGeoTagComponent } from './create-geo-tag.component';

describe('CreateGeoTagComponent', () => {
  let component: CreateGeoTagComponent;
  let fixture: ComponentFixture<CreateGeoTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateGeoTagComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateGeoTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
