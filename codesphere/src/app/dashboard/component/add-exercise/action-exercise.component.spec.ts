import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionExerciseComponent } from './action-exercise.component';

describe('ActionExerciseComponent', () => {
  let component: ActionExerciseComponent;
  let fixture: ComponentFixture<ActionExerciseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionExerciseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionExerciseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
