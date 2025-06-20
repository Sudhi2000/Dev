import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRenewableFuelComponent } from './add-renewable-fuel.component';

describe('AddRenewableFuelComponent', () => {
  let component: AddRenewableFuelComponent;
  let fixture: ComponentFixture<AddRenewableFuelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRenewableFuelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRenewableFuelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
