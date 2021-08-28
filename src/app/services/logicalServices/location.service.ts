import { ElementRef, Injectable, NgZone } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject, Subject } from 'rxjs';
import { MapLocation } from 'src/app/models/location.model';
import { MapDataService } from '../dataServices/mapData.service';
import { LocalstorageService } from '../helperServices/localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

constructor(private spinner: NgxSpinnerService,
  private ngZone: NgZone,
  private mapDataService: MapDataService,
  private storageService: LocalstorageService) { 
    this.mapDataService.initLocation();
  }

setLocation(location: MapLocation) {
  this.mapDataService.setLocation(location);
}

getLocation() {
  return this.mapDataService.location$;
}

clearLocation() {
  this.mapDataService.clearLocation();
  this.mapDataService.emptyPlaceTypeDataSet();
  this.storageService.clearAll();
}

public setCurrentLocation() {
  this.spinner.show();
  const geocoder = new google.maps.Geocoder();
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position);
        const latlng = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        geocoder.geocode({ location: latlng }, (result) => {
          const address = result.length > 2 ? result[1].formatted_address : result[0].formatted_address;
          this.setLocation(
            {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              zoom: 14,
              address: address,
              name: address.split(',')[0]
            });
            this.spinner.hide(undefined, 1000);
        });
        
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
            this.spinner.hide();
            return;
          }
          //set latitude, longitude and zoom
          this.setLocation(
            {
              latitude: place.geometry.location.lat(), 
              longitude: place.geometry.location.lng(),
              zoom: 14, 
              address: place.name + ', ' + place.formatted_address,
              name: place.name
            });
            this.spinner.hide(undefined, 1000);

        });
      });
}
}
