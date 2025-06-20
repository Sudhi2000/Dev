import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualTopicComponent } from './individual-topic.component';

describe('IndividualTopicComponent', () => {
  let component: IndividualTopicComponent;
  let fixture: ComponentFixture<IndividualTopicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndividualTopicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualTopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
