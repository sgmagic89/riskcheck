/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { HazzardDataService } from './hazzardData.service';

describe('Service: HazzardData', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HazzardDataService]
    });
  });

  it('should ...', inject([HazzardDataService], (service: HazzardDataService) => {
    expect(service).toBeTruthy();
  }));
});
