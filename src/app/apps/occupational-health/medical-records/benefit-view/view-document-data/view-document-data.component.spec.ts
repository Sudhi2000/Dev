import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDocumentDataComponent } from './view-document-data.component';

describe('ViewDocumentDataComponent', () => {
  let component: ViewDocumentDataComponent;
  let fixture: ComponentFixture<ViewDocumentDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDocumentDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDocumentDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
