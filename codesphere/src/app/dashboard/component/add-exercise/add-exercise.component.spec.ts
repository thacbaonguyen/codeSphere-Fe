import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExerciseComponent } from './add-exercise.component';

describe('AddExerciseComponent', () => {
  let component: AddExerciseComponent;
  let fixture: ComponentFixture<AddExerciseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddExerciseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddExerciseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
