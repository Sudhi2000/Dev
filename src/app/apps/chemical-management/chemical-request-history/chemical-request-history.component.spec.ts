import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChemicalRequestHistoryComponent } from './chemical-request-history.component';

describe('ChemicalRequestHistoryComponent', () => {
  let component: ChemicalRequestHistoryComponent;
  let fixture: ComponentFixture<ChemicalRequestHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChemicalRequestHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChemicalRequestHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
