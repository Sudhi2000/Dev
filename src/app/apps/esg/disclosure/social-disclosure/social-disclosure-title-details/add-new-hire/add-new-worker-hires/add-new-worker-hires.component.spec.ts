import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewWorkerHiresComponent } from './add-new-worker-hires.component';

describe('AddNewWorkerHiresComponent', () => {
  let component: AddNewWorkerHiresComponent;
  let fixture: ComponentFixture<AddNewWorkerHiresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewWorkerHiresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewWorkerHiresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
