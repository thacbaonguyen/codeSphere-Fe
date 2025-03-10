import { TestBed } from '@angular/core/testing';

import { CommentBlogService } from './comment-blog.service';

describe('CommentBlogService', () => {
  let service: CommentBlogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommentBlogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
