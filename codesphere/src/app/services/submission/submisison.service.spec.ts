import { TestBed } from '@angular/core/testing';

import { SubmisisonService } from './submisison.service';

describe('SubmisisonService', () => {
  let service: SubmisisonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubmisisonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
