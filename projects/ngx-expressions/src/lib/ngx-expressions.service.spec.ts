import { TestBed, inject } from '@angular/core/testing';

import { NgxExpressionsService } from './ngx-expressions.service';

describe('NgxExpressionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgxExpressionsService]
    });
  });

  it('should be created', inject([NgxExpressionsService], (service: NgxExpressionsService) => {
    expect(service).toBeTruthy();
  }));
});
