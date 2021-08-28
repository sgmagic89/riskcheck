import { MapsAPILoader } from '@agm/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocationService } from 'src/app/services/logicalServices/location.service';
import { PlacesService } from 'src/app/services/logicalServices/places.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  constructor(private placesService: PlacesService, public locationService: LocationService, private router: Router) { }

  ngOnInit() {
    this.placesService.mapInitialized$.subscribe(initialized => {
      if(initialized) {
        this.placesService.analyseLocation();
      }
    })
  }

  search() {
    this.router.navigate(['search']);
  }

}
