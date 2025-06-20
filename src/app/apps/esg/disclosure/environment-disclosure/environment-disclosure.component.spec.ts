import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvironmentDisclosureComponent } from './environment-disclosure.component';

describe('EnvironmentDisclosureComponent', () => {
  let component: EnvironmentDisclosureComponent;
  let fixture: ComponentFixture<EnvironmentDisclosureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnvironmentDisclosureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvironmentDisclosureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
