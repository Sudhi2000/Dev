import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewIssuingAuthorityComponent } from './new-issuing-authority.component';

describe('NewIssuingAuthorityComponent', () => {
  let component: NewIssuingAuthorityComponent;
  let fixture: ComponentFixture<NewIssuingAuthorityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewIssuingAuthorityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewIssuingAuthorityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
