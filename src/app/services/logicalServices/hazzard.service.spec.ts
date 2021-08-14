/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { HazzardService } from './hazzard.service';

describe('Service: Hazzard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HazzardService]
    });
  });

  it('should ...', inject([HazzardService], (service: HazzardService) => {
    expect(service).toBeTruthy();
  }));
});
