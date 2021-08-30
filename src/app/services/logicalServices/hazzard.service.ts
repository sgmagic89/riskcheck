import { Ratings } from 'src/app/models/rating.enum';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { EarthQuakeParameters } from 'src/app/models/eartQuakeData.model';
import { HazzardDataService } from '../dataServices/hazzardData.service';


@Injectable({
  providedIn: 'root'
})
export class HazzardService {
hazardName = 'Earth Quake';
private _isVisible = new BehaviorSubject(false);
isHazardDataVisible$ = this._isVisible.asObservable();
constructor(private hazzardDataService: HazzardDataService) { }

getEarthQuakeDataFromAPI(params: EarthQuakeParameters) {
  this.hazzardDataService.getEarthQuakeData(params);
}

getEarthQuakeData() {
  return this.hazzardDataService.earthQuakeData$;
}

toogleHazzardDataVisibility() {
  this._isVisible.next(!this._isVisible.getValue());
}

updateRating(rating: Ratings) {
  this.hazzardDataService.updateRating(rating);
}


}
