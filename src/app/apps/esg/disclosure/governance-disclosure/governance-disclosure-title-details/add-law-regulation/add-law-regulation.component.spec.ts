import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLawRegulationComponent } from './add-law-regulation.component';

describe('AddLawRegulationComponent', () => {
  let component: AddLawRegulationComponent;
  let fixture: ComponentFixture<AddLawRegulationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLawRegulationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLawRegulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
