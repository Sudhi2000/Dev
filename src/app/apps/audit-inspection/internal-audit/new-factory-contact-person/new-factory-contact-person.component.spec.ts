import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewFactoryContactPersonComponent } from './new-factory-contact-person.component';

describe('NewFactoryContactPersonComponent', () => {
  let component: NewFactoryContactPersonComponent;
  let fixture: ComponentFixture<NewFactoryContactPersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewFactoryContactPersonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewFactoryContactPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
