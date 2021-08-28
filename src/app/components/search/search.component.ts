import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { LocationService } from 'src/app/services/logicalServices/location.service';
import { Router } from '@angular/router';
import { PlacesService } from 'src/app/services/logicalServices/places.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  @ViewChild('search')
  public searchElementRef: ElementRef = <ElementRef>{};
  locationFound = false;
  constructor(public locationService: LocationService,
    private placesService: PlacesService,
    private mapsAPILoader: MapsAPILoader,
    private router: Router) { }

  ngOnInit() {
    this.mapsAPILoader.load().then(() => {
      this.locationService.searchAddress(this.searchElementRef);
    });
    this.locationService.getLocation().subscribe(location => {
      if(location.address && location.address.length > 0) {
        this.locationFound = true;
      } else {
        this.locationFound = false;
      }
    });
    this.placesService.clearPlacesData();
  }

  startaAnalysis() {
    this.placesService.analyseLocation();
    this.router.navigate(['configure']);
  }

  clearLocation() {
    this.locationService.clearLocation();
  }
}
