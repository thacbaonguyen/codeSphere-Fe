import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseRsComponent } from './course-rs.component';

describe('CourseRsComponent', () => {
  let component: CourseRsComponent;
  let fixture: ComponentFixture<CourseRsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseRsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseRsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
