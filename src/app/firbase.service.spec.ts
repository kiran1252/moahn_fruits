import { TestBed } from '@angular/core/testing';

import { FirbaseService } from './firbase.service';

describe('FirbaseService', () => {
  let service: FirbaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirbaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
