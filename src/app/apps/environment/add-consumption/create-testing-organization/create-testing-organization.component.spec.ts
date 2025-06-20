import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTestingOrganizationComponent } from './create-testing-organization.component';

describe('CreateTestingOrganizationComponent', () => {
  let component: CreateTestingOrganizationComponent;
  let fixture: ComponentFixture<CreateTestingOrganizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTestingOrganizationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTestingOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
