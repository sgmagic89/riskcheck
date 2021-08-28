import { Component, ElementRef, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
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
  @Output() analyze= new EventEmitter();
  
  constructor(public locationService: LocationService, 
    private mapsAPILoader: MapsAPILoader) { }

  ngOnInit() {
    this.mapsAPILoader.load().then(() => {
      this.locationService.setCurrentLocation();
      this.locationService.searchAddress(this.searchElementRef);
    });
  }

  analyzeClick(){
    this.analyze.emit("");
  }

}
