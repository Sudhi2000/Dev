import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovernanceDisclosureComponent } from './governance-disclosure.component';

describe('GovernanceDisclosureComponent', () => {
  let component: GovernanceDisclosureComponent;
  let fixture: ComponentFixture<GovernanceDisclosureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GovernanceDisclosureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GovernanceDisclosureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
