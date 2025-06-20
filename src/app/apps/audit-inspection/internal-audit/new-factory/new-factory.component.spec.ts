import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewFactoryComponent } from './new-factory.component';

describe('NewFactoryComponent', () => {
  let component: NewFactoryComponent;
  let fixture: ComponentFixture<NewFactoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewFactoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewFactoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
