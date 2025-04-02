import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionCourseComponent } from './action-course.component';

describe('ActionCourseComponent', () => {
  let component: ActionCourseComponent;
  let fixture: ComponentFixture<ActionCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionCourseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
