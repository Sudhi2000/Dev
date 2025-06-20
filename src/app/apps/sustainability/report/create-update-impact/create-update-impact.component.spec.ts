import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateImpactComponent } from './create-update-impact.component';

describe('CreateUpdateImpactComponent', () => {
  let component: CreateUpdateImpactComponent;
  let fixture: ComponentFixture<CreateUpdateImpactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateUpdateImpactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUpdateImpactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
