import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialDisclosureComponent } from './social-disclosure.component';

describe('SocialDisclosureComponent', () => {
  let component: SocialDisclosureComponent;
  let fixture: ComponentFixture<SocialDisclosureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SocialDisclosureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialDisclosureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
