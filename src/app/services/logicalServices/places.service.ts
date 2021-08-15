import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ElementRef, NgZone } from '@angular/core';
import { PlacesType } from '../../models/placesType.model';
import { PlaceTypeData } from '../../models/placeTypeData.model';
import { LocalstorageService } from '../dataServices/localstorage.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocationService } from './location.service';
import { MapLocation } from 'src/app/models/location.model';
import { AgmMap } from '@agm/core';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
agmMap: any;
googlePalcesService: any;
currentLocation: MapLocation = <MapLocation>{};
private _placeTypes = new BehaviorSubject<PlacesType[]>([]);
placeTypes$ = this._placeTypes.asObservable();

private placeTypeDataSet: PlaceTypeData[] = [];
private _placeTypeDataSet = new Subject<PlaceTypeData[]>();
placeTypeDataSet$ = this._placeTypeDataSet.asObservable();

constructor(private storageService: LocalstorageService, 
  private spinner: NgxSpinnerService,
  private locationService: LocationService,
  private ngZone: NgZone) { }

initPlacesService(agmMap: any) {
  this.agmMap = agmMap;
  this.locationService.location$.subscribe(location => {
    if(location.longitude && location.latitude) {
      this.currentLocation.latitude = location.latitude;
      this.currentLocation.longitude = location.longitude;
      this.getPlaces(this.getPlaceTypes(), location);
      this.hideSpinner(2000);
    }
  });
}


getPlaces(types: PlacesType[], location: MapLocation) {
  this.spinner.show();
  this.emptyPlaceTypeDataSet();
  this.ngZone.run(() => {
    this.googlePalcesService = new google.maps.places.PlacesService(this.agmMap);
    for (let type of types) {
      if (type.isVisible) {
        const query = {
          location: {lat: location.latitude, lng: location.longitude},
          type: [type.type],
          keyword: [type.keyword],
          rankBy:1
        };
        this.googlePalcesService.nearbySearch(
          query,
          (results: any, status: any, pagination: any) => {
            if (status !== 'OK') {
              return;
            }
            this.spinner.hide();
            this.createMarkers(results, type);
            results.map((res:any)=>{
              res["distance"]=this.getDistance({lat:location.latitude, lng:location.longitude}, {lat:res.geometry.location.lat(),lng:res.geometry.location.lng()} )
              return res;
            })
            console.log(type.displayName, results);
  
            // if(pagination.hasNextPage) {
            //   pagination.nextPage();
            //   this.spinner.show();
            // }
          }
        );
      }
    }
  });
 
}

createMarkers(places: any, placeType: PlacesType) {
  let bounds = new google.maps.LatLngBounds();
  for (var i = 0, place; (place = places[i]); i++) {
    let location = place.geometry.location;
    let icon = {
      url: place.icon,
      scaledSize: {
        width: 24,
        height: 24,
      },
    };
    this.updatePlaceTypeData(placeType, {
      latitude: location.lat(),
      longitude: location.lng(),
      name: place.name,
      icon: icon,
    });
    bounds.extend(place.geometry.location);
  }
  this.agmMap.fitBounds(bounds);
}

rad = (x:number)=> x * Math.PI / 180;

getDistance = (p1:{lat:number,lng:number}, p2:{lat:number,lng:number})=> {
  var R = 6378137; // Earth’s mean radius in meter
  var dLat = this.rad(p2.lat - p1.lat);
  var dLong = this.rad(p2.lng - p1.lng);
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(this.rad(p1.lat)) * Math.cos(this.rad(p2.lat)) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d; // returns the distance in meter
}

getPlaceTypes() {
  return this._placeTypes.getValue();
}

addPlaceType(placeType: PlacesType) {
  const placeTypes = this._placeTypes.getValue();
  const updatedpPaceTypes = [...placeTypes, placeType];
  this._placeTypes.next(updatedpPaceTypes);
  if(this.agmMap) {
    this.getPlaces(this.getPlaceTypes(), this.currentLocation);
    this.hideSpinner(2000);
  }
  this.storageService.removeItem('filters');
  this.storageService.setItem('filters', updatedpPaceTypes);
}

deletePlaceType(placeType: PlacesType) {
  const placeTypes = this._placeTypes.getValue();
  const updatedpPaceTypes = placeTypes.filter(filter => filter.displayName != placeType.displayName);
  this._placeTypes.next(updatedpPaceTypes);
  this.getPlaces(this.getPlaceTypes(), this.currentLocation);
  this.hideSpinner(2000);
  this.storageService.removeItem('filters');
  this.storageService.setItem('filters', updatedpPaceTypes);
}


updatePlaceTypeVisibility(placeType: string, visible: boolean) {
  let placeTypes = this._placeTypes.getValue();
  placeTypes.forEach(type => {
    if(type.displayName === placeType) {
      type.isVisible = visible;
    }
  });
  this._placeTypes.next(placeTypes);
  this.getPlaces(this.getPlaceTypes(), this.currentLocation);
  this.hideSpinner(2000);
  this.storageService.removeItem('filters');
  this.storageService.setItem('filters', placeTypes);
}

updatePlaceTypeData(placeType: PlacesType, data: any) {
  const dataExists = this.placeTypeDataSet.some( type => type.placeType.displayName === placeType.displayName);
  if(dataExists) {
    this.placeTypeDataSet.forEach( type => {
      if(type.placeType.displayName === placeType.displayName) {
        type.data.push(data);
      }
    });
  } else {
    const plaeTypeData = new PlaceTypeData(placeType);
    plaeTypeData.data.push(data)
    this.placeTypeDataSet.push(plaeTypeData);
  }
  this._placeTypeDataSet.next(this.placeTypeDataSet);
}

createDefaultPlaceTypes() {
  const filters: any[] = this.storageService.getItem('filters')
  if(!filters) {
    let placeType = new PlacesType('Hospital',false,'hospital');
    this.addPlaceType(placeType);
    placeType = new PlacesType('Police Station',false,'police');
    this.addPlaceType(placeType);
    placeType = new PlacesType('Fire Station',false,undefined,'fire station');
    this.addPlaceType(placeType);
    this.storageService.setItem('filters', this._placeTypes.getValue())
  } else {
    filters.forEach(filter => {
      this.addPlaceType(filter);
    })
  }
  
}

emptyPlaceTypeDataSet() {
  this.placeTypeDataSet.length = 0;
  this._placeTypeDataSet.next(this.placeTypeDataSet);
}


hideSpinner(timeout: number) {
  setTimeout(() => {
    this.spinner.hide();
  }, timeout);
  if (!this.getPlaceTypes().some((type) => type.isVisible === true)) {
    // this.zoom = location.zoom;
    setTimeout(() => {
      this.spinner.hide();
    }, timeout);
  }
}

}
