import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChemicalDashboardComponent } from './chemical-dashboard.component';

describe('ChemicalDashboardComponent', () => {
  let component: ChemicalDashboardComponent;
  let fixture: ComponentFixture<ChemicalDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChemicalDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChemicalDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
