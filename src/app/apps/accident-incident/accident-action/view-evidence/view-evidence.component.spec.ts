import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEvidenceComponent } from './view-evidence.component';

describe('ViewEvidenceComponent', () => {
  let component: ViewEvidenceComponent;
  let fixture: ComponentFixture<ViewEvidenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewEvidenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEvidenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
