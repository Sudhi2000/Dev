import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateIndustryComponent } from './create-industry.component';

describe('CreateIndustryComponent', () => {
  let component: CreateIndustryComponent;
  let fixture: ComponentFixture<CreateIndustryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateIndustryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateIndustryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
