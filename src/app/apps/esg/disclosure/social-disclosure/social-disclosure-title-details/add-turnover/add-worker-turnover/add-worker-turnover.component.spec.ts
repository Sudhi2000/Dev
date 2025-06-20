import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWorkerTurnoverComponent } from './add-worker-turnover.component';

describe('AddWorkerTurnoverComponent', () => {
  let component: AddWorkerTurnoverComponent;
  let fixture: ComponentFixture<AddWorkerTurnoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddWorkerTurnoverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWorkerTurnoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
