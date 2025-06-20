import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChemicalRequestComponent } from './chemical-request.component';

describe('ChemicalRequestComponent', () => {
  let component: ChemicalRequestComponent;
  let fixture: ComponentFixture<ChemicalRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChemicalRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChemicalRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
