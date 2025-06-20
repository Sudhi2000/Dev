import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAllegedPartyComponent } from './new-alleged-party.component';

describe('NewAllegedPartyComponent', () => {
  let component: NewAllegedPartyComponent;
  let fixture: ComponentFixture<NewAllegedPartyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewAllegedPartyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAllegedPartyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
