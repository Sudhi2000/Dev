import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewIssuedUserComponent } from './new-issued-user.component';

describe('NewIssuedUserComponent', () => {
  let component: NewIssuedUserComponent;
  let fixture: ComponentFixture<NewIssuedUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewIssuedUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewIssuedUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
