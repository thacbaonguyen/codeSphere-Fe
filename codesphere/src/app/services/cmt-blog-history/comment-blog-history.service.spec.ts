import { TestBed } from '@angular/core/testing';

import { CommentBlogHistoryService } from './comment-blog-history.service';

describe('CommentBlogHistoryService', () => {
  let service: CommentBlogHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommentBlogHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
