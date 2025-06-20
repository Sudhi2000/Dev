import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDisposalComponent } from './create-disposal.component';

describe('CreateDisposalComponent', () => {
  let component: CreateDisposalComponent;
  let fixture: ComponentFixture<CreateDisposalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateDisposalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDisposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
