import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageConditionComponent } from './storage-condition.component';

describe('StorageConditionComponent', () => {
  let component: StorageConditionComponent;
  let fixture: ComponentFixture<StorageConditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StorageConditionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
