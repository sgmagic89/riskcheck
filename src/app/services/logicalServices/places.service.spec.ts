/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PlacesService } from './places.service';

describe('Service: Places', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlacesService]
    });
  });

  it('should ...', inject([PlacesService], (service: PlacesService) => {
    expect(service).toBeTruthy();
  }));
});
