import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChemicalReviewComponent } from './chemical-review.component';

describe('ChemicalReviewComponent', () => {
  let component: ChemicalReviewComponent;
  let fixture: ComponentFixture<ChemicalReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChemicalReviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChemicalReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
