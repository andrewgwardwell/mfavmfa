import { TestBed } from '@angular/core/testing';

import { OpenLibraryService } from './open-library.service';

describe('OpenLibraryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OpenLibraryService = TestBed.get(OpenLibraryService);
    expect(service).toBeTruthy();
  });
});
