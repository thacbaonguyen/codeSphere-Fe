import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseRsComponent } from './exercise-rs.component';

describe('ExerciseRsComponent', () => {
  let component: ExerciseRsComponent;
  let fixture: ComponentFixture<ExerciseRsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExerciseRsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExerciseRsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
