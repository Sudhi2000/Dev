import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyImpactComponent } from './modify-impact.component';

describe('ModifyImpactComponent', () => {
  let component: ModifyImpactComponent;
  let fixture: ComponentFixture<ModifyImpactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyImpactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyImpactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
