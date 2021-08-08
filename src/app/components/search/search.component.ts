import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { MapService } from 'src/app/services/map.service';
import { MapsAPILoader } from '@agm/core';
import { PlacesType } from 'src/app/models/placesType.model';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  @ViewChild('search')
  public searchElementRef: ElementRef = <ElementRef>{};
  private geoCoder: any = {};
  public placeTypes: PlacesType[] = [];
  constructor(public mapService: MapService, 
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone) { }

  ngOnInit() {
    this.mapService.createDefaultPlaceTypes();

    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;

      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.mapService.setLocation({latitude: place.geometry.location.lat(), longitude: place.geometry.location.lng()});
        });
      });
    });
  }

  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.mapService.setLocation({latitude: position.coords.latitude, longitude: position.coords.longitude});
      });
    }
  }

}
