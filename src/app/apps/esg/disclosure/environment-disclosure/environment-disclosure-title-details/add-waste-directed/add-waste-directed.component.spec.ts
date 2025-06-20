import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWasteDirectedComponent } from './add-waste-directed.component';

describe('AddWasteDirectedComponent', () => {
  let component: AddWasteDirectedComponent;
  let fixture: ComponentFixture<AddWasteDirectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddWasteDirectedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWasteDirectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
