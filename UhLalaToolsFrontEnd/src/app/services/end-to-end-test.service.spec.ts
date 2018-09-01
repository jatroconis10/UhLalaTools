import { TestBed, inject } from '@angular/core/testing';

import { EndToEndTestService } from './end-to-end-test.service';

describe('EndToEndTestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EndToEndTestService]
    });
  });

  it('should be created', inject([EndToEndTestService], (service: EndToEndTestService) => {
    expect(service).toBeTruthy();
  }));
});
