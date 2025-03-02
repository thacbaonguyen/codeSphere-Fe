import { TestBed } from '@angular/core/testing';

import { ContributeService } from './contribute.service';

describe('ContributeService', () => {
  let service: ContributeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContributeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
