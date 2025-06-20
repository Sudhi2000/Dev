import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChemicalRequestModifyComponent } from './chemical-request-modify.component';

describe('ChemicalRequestModifyComponent', () => {
  let component: ChemicalRequestModifyComponent;
  let fixture: ComponentFixture<ChemicalRequestModifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChemicalRequestModifyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChemicalRequestModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
