import { Ratings } from 'src/app/models/rating.enum';
import { HazzardService } from 'src/app/services/logicalServices/hazzard.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LocationService } from 'src/app/services/logicalServices/location.service';
import { EarthQuakeData, EarthQuakeParameters } from 'src/app/models/eartQuakeData.model';
@Component({
  selector: 'app-geo-filters',
  templateUrl: './geo-filters.component.html',
  styleUrls: ['./geo-filters.component.scss']
})
export class GeoFiltersComponent implements OnInit, OnDestroy {
  hazzarSubscription: Subscription = <Subscription>{};
  mapSubscription: Subscription = <Subscription>{};
  earthQuakeData: EarthQuakeData = new EarthQuakeData();
  earthQuakeParams: EarthQuakeParameters = new EarthQuakeParameters();
  ratings = Ratings;
  constructor(public hazardService: HazzardService,
    private locationService: LocationService,) { }

  ngOnInit() {
    this.hazzarSubscription = this.hazardService.getEarthQuakeData().subscribe(
      data => {
        this.earthQuakeData = data;
        console.log('EarthQuake Data', data);
      }
    );

    this.mapSubscription = this.locationService.getLocation().subscribe((location) => {
      if(location.latitude && location.longitude) {
        this.earthQuakeParams.latitude = location.latitude;
        this.earthQuakeParams.longitude = location.longitude;
        this.hazardService.getEarthQuakeDataFromAPI(this.earthQuakeParams);
      }
    });
  }

  refreshData() {
    this.hazardService.getEarthQuakeDataFromAPI(this.earthQuakeParams);
  }

  rate(rating: Ratings) {
    this.hazardService.updateRating(rating);
  }

  isSelected(rating: Ratings) {
    return this.earthQuakeData.rating === rating;
  }

  ngOnDestroy() {
    this.hazzarSubscription.unsubscribe();
    this.mapSubscription.unsubscribe();
  }

}
