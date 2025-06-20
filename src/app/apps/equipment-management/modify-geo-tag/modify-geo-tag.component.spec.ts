import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyGeoTagComponent } from './modify-geo-tag.component';

describe('ModifyGeoTagComponent', () => {
  let component: ModifyGeoTagComponent;
  let fixture: ComponentFixture<ModifyGeoTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyGeoTagComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyGeoTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
