import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDocumentHistoryComponent } from './view-document-history.component';

describe('ViewDocumentHistoryComponent', () => {
  let component: ViewDocumentHistoryComponent;
  let fixture: ComponentFixture<ViewDocumentHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDocumentHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDocumentHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
