import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralDisclosureModifyComponent } from './general-disclosure-modify.component';

describe('GeneralDisclosureModifyComponent', () => {
  let component: GeneralDisclosureModifyComponent;
  let fixture: ComponentFixture<GeneralDisclosureModifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralDisclosureModifyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralDisclosureModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
