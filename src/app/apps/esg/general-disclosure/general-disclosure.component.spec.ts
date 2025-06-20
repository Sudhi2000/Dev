import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralDisclosureComponent } from './general-disclosure.component';

describe('GeneralDisclosureComponent', () => {
  let component: GeneralDisclosureComponent;
  let fixture: ComponentFixture<GeneralDisclosureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralDisclosureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralDisclosureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
