import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadNewVersionComponent } from './upload-new-version.component';

describe('UploadNewVersionComponent', () => {
  let component: UploadNewVersionComponent;
  let fixture: ComponentFixture<UploadNewVersionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadNewVersionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadNewVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
