import { Injectable } from '@angular/core';
import { EarthQuakeParameters } from 'src/app/models/eartQuakeData.model';
import { HazzardDataService } from '../dataServices/hazzardData.service';


@Injectable({
  providedIn: 'root'
})
export class HazzardService {

constructor(private hazzardDataService: HazzardDataService) { }

getEarthQuakeDataFromAPI(params: EarthQuakeParameters) {
  this.hazzardDataService.getEarthQuakeData(params);
}

getEarthQuakeData() {
  return this.hazzardDataService.earthQuakeData$;
}


}
