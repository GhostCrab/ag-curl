import { TestBed } from '@angular/core/testing';

import { DraftDatabaseService } from './draft-database.service';

describe('DraftDatabaseService', () => {
  let service: DraftDatabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DraftDatabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
