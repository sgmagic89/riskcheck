import { ElementRef, Injectable, NgZone } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject } from 'rxjs';
import { MapLocation } from 'src/app/models/location.model';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

constructor(private spinner: NgxSpinnerService,
  private ngZone: NgZone) { }

private _location = new BehaviorSubject<MapLocation>(<MapLocation>{});
location$ = this._location.asObservable();

setLocation(location: MapLocation) {
  this._location.next(location);
}

public setCurrentLocation() {
  this.spinner.show();
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.setLocation({latitude: position.coords.latitude, longitude: position.coords.longitude, zoom: 14});
      }, (err) => {
        this.spinner.hide();
      });
    }
}

public searchAddress(element: ElementRef<any>) {
  let autocomplete = new google.maps.places.Autocomplete(element.nativeElement);
      autocomplete.addListener("place_changed", () => {
        this.spinner.show();
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.setLocation({latitude: place.geometry.location.lat(), longitude: place.geometry.location.lng(), zoom: 14});
        });
      });
}
}
