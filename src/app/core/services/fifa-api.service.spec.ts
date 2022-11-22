import { TestBed } from '@angular/core/testing';

import { FifaApiService } from './fifa-api.service';

describe('FifaApiService', () => {
  let service: FifaApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FifaApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
