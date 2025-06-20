import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewPollutantComponent } from './create-new-pollutant.component';

describe('CreateNewPollutantComponent', () => {
  let component: CreateNewPollutantComponent;
  let fixture: ComponentFixture<CreateNewPollutantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateNewPollutantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewPollutantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
