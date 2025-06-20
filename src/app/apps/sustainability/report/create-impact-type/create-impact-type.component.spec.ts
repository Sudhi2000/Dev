import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateImpactTypeComponent } from './create-impact-type.component';

describe('CreateImpactTypeComponent', () => {
  let component: CreateImpactTypeComponent;
  let fixture: ComponentFixture<CreateImpactTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateImpactTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateImpactTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
