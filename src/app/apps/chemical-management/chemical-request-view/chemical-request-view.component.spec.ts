import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChemicalRequestViewComponent } from './chemical-request-view.component';

describe('ChemicalRequestViewComponent', () => {
  let component: ChemicalRequestViewComponent;
  let fixture: ComponentFixture<ChemicalRequestViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChemicalRequestViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChemicalRequestViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
