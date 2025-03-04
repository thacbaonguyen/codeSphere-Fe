import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseDetailsComponent } from './exercise-details.component';

describe('ExerciseDetailsComponent', () => {
  let component: ExerciseDetailsComponent;
  let fixture: ComponentFixture<ExerciseDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExerciseDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExerciseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
