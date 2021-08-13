import { Component, OnDestroy, OnInit } from '@angular/core';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { Subscription } from 'rxjs';
import { EarthQuakeParameters } from 'src/app/models/eartQuakeData.model';
import { HazzardService } from 'src/app/services/hazzard.service';
import { MapService } from 'src/app/services/map.service';

@AutoUnsubscribe()
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  mapSubscription: Subscription = <Subscription>{};
  hazzarSubscription: Subscription = <Subscription>{};
  constructor(private mapService: MapService, private hazzardService: HazzardService) { }

  ngOnInit() {
    this.mapSubscription = this.mapService.location$.subscribe((location) => {
      if(location.latitude && location.longitude) {
        const params = new EarthQuakeParameters();
        params.latitude = location.latitude;
        params.longitude = location.longitude;
        this.hazzarSubscription = this.hazzardService.getEarthQuakeData(params).subscribe(
          data => {
            console.log(data);
          }
        )
      }
    });
  }

  ngOnDestroy() {

  }



}
