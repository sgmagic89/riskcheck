import { AgmMap } from '@agm/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MapLocation } from 'src/app/models/location.model';
import { LocationService } from 'src/app/services/logicalServices/location.service';
import { PlacesService } from 'src/app/services/logicalServices/places.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  location: MapLocation = <MapLocation>{};
  agmMap: any;

  @ViewChild('AgmMap') set content(map: AgmMap) {
    if (map) {
      map.mapReady.subscribe((map) => {
        this.placesService.initPlacesService(map);
      });
    }
  }
  constructor(
    public locationService: LocationService,
    public placesService: PlacesService
  ) {}

  ngOnInit() {
      this.locationService.location$.subscribe(location => {
        this.location = location;
      });
  }


}
