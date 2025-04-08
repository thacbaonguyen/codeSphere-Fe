import { TestBed } from '@angular/core/testing';

import { CourseAccessService } from './course-access.service';

describe('CourseAccessService', () => {
  let service: CourseAccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourseAccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
