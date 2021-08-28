import { Component, OnDestroy, OnInit } from '@angular/core';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { Subscription } from 'rxjs';
import { EarthQuakeParameters } from 'src/app/models/eartQuakeData.model';
import { HazzardService } from 'src/app/services/logicalServices/hazzard.service';
import { LocationService } from 'src/app/services/logicalServices/location.service';
import { PlacesService } from 'src/app/services/logicalServices/places.service';

@AutoUnsubscribe()
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  mapSubscription: Subscription = <Subscription>{};
  hazzarSubscription: Subscription = <Subscription>{};
  isMapVisible = false;
  constructor(private locationService: LocationService,
    private placesService: PlacesService,
    private hazzardService: HazzardService) { }

  ngOnInit() {
    this.hazzarSubscription = this.hazzardService.getEarthQuakeData().subscribe(
      data => {
        console.log('EarthQuake Data', data);
      }
    )
    this.placesService.createDefaultPlaceTypes();
    this.mapSubscription = this.locationService.getLocation().subscribe((location) => {
      if(location.latitude && location.longitude) {
        const params = new EarthQuakeParameters();
        params.latitude = location.latitude;
        params.longitude = location.longitude;
        this.hazzardService.getEarthQuakeDataFromAPI(params);
      }
      if(location.address) {
        this.isMapVisible = true;
      }
    });
  }

  ngOnDestroy() {

  }



}
