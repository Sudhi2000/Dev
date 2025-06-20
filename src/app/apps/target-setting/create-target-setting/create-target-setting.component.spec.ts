import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTargetSettingComponent } from './create-target-setting.component';

describe('CreateTargetSettingComponent', () => {
  let component: CreateTargetSettingComponent;
  let fixture: ComponentFixture<CreateTargetSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTargetSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTargetSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
