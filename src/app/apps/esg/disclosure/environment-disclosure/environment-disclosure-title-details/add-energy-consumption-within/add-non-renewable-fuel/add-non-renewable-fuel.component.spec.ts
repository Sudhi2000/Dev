import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNonRenewableFuelComponent } from './add-non-renewable-fuel.component';

describe('AddNonRenewableFuelComponent', () => {
  let component: AddNonRenewableFuelComponent;
  let fixture: ComponentFixture<AddNonRenewableFuelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNonRenewableFuelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNonRenewableFuelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
