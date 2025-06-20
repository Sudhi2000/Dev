import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFacilityPhotoComponent } from './upload-facility-photo.component';

describe('UploadFacilityPhotoComponent', () => {
  let component: UploadFacilityPhotoComponent;
  let fixture: ComponentFixture<UploadFacilityPhotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadFacilityPhotoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadFacilityPhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
