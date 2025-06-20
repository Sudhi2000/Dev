import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEiaOfProjectComponent } from './add-eia-of-project.component';

describe('AddEiaOfProjectComponent', () => {
  let component: AddEiaOfProjectComponent;
  let fixture: ComponentFixture<AddEiaOfProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEiaOfProjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEiaOfProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
