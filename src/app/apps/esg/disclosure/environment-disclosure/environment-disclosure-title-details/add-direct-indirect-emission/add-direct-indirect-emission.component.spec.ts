import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDirectIndirectEmissionComponent } from './add-direct-indirect-emission.component';

describe('AddDirectIndirectEmissionComponent', () => {
  let component: AddDirectIndirectEmissionComponent;
  let fixture: ComponentFixture<AddDirectIndirectEmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDirectIndirectEmissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDirectIndirectEmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
