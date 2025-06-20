import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateIndustryTypeComponent } from './create-industry-type.component';

describe('CreateIndustryTypeComponent', () => {
  let component: CreateIndustryTypeComponent;
  let fixture: ComponentFixture<CreateIndustryTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateIndustryTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateIndustryTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
