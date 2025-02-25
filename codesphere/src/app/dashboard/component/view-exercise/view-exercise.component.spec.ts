import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewExerciseComponent } from './view-exercise.component';

describe('ViewExerciseComponent', () => {
  let component: ViewExerciseComponent;
  let fixture: ComponentFixture<ViewExerciseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewExerciseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewExerciseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
