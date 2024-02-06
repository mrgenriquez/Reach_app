import { TestBed } from '@angular/core/testing';

import { ReachService } from './reach.service';

describe('ReachService', () => {
  let service: ReachService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReachService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
