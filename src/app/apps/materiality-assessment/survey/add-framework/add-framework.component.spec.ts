import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFrameworkComponent } from './add-framework.component';

describe('AddFrameworkComponent', () => {
  let component: AddFrameworkComponent;
  let fixture: ComponentFixture<AddFrameworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFrameworkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFrameworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
