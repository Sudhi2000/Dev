import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCheckOutComponent } from './update-check-out.component';

describe('UpdateCheckOutComponent', () => {
  let component: UpdateCheckOutComponent;
  let fixture: ComponentFixture<UpdateCheckOutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateCheckOutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCheckOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
