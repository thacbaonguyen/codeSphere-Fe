import { TestBed } from '@angular/core/testing';

import { AccessRoleService } from './access-role.service';

describe('AccessRoleService', () => {
  let service: AccessRoleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccessRoleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
