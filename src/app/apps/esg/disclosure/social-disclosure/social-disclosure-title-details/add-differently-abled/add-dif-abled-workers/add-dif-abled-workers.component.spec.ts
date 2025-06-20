import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDifAbledWorkersComponent } from './add-dif-abled-workers.component';

describe('AddDifAbledWorkersComponent', () => {
  let component: AddDifAbledWorkersComponent;
  let fixture: ComponentFixture<AddDifAbledWorkersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDifAbledWorkersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDifAbledWorkersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
