import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralDisclosureViewComponent } from './general-disclosure-view.component';

describe('GeneralDisclosureViewComponent', () => {
  let component: GeneralDisclosureViewComponent;
  let fixture: ComponentFixture<GeneralDisclosureViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralDisclosureViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralDisclosureViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
