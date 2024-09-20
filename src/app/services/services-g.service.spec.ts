import { TestBed } from '@angular/core/testing';

import { ServicesGService } from './services-g.service';

describe('ServicesGService', () => {
  let service: ServicesGService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicesGService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
