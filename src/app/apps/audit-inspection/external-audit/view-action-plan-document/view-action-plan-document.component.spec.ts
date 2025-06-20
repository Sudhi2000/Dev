import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewActionPlanDocumentComponent } from './view-action-plan-document.component';

describe('ViewActionPlanDocumentComponent', () => {
  let component: ViewActionPlanDocumentComponent;
  let fixture: ComponentFixture<ViewActionPlanDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewActionPlanDocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewActionPlanDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
