import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { LocationService } from 'src/app/services/logicalServices/location.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  @ViewChild('search')
  public searchElementRef: ElementRef = <ElementRef>{};

  constructor(public locationService: LocationService, 
    private mapsAPILoader: MapsAPILoader) { }

  ngOnInit() {
    this.mapsAPILoader.load().then(() => {
      this.locationService.setCurrentLocation();
      this.locationService.searchAddress(this.searchElementRef);
    });
  }


  

}
