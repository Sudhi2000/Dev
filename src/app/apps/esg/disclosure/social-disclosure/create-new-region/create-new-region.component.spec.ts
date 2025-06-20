import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewRegionComponent } from './create-new-region.component';

describe('CreateNewRegionComponent', () => {
  let component: CreateNewRegionComponent;
  let fixture: ComponentFixture<CreateNewRegionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateNewRegionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewRegionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
