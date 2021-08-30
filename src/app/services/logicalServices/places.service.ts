import { Ratings } from './../../models/rating.enum';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { PlacesType } from '../../models/placesType.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocationService } from './location.service';
import { MapLocation } from 'src/app/models/location.model';
import { MapDataService } from '../dataServices/mapData.service';
import { LocalstorageService } from '../helperServices/localstorage.service';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  agmMap: any;
  googlePalcesService: any;
  currentLocation: MapLocation = <MapLocation>{};
  private _mapInitialized = new Subject();
  mapInitialized$ = this._mapInitialized.asObservable();

  constructor(
    private spinner: NgxSpinnerService,
    private locationService: LocationService,
    private mapDataService: MapDataService,
    private storageService: LocalstorageService
  ) {}

  initPlacesService(agmMap: any) {
    this.agmMap = agmMap;
    this._mapInitialized.next(true);
  }

  analyseLocation() {
    this.locationService.getLocation().subscribe((location) => {
      if (location.longitude && location.latitude) {
        this.currentLocation.latitude = location.latitude;
        this.currentLocation.longitude = location.longitude;
        this.getPlacesFromAPI(this.mapDataService.getPlaceTypes(), location);
        this.hideSpinner(2000);
      }
    });
  }

  getPlacesData() {
    return this.mapDataService.placesData$;
  }

  getPlaceTypes() {
    return this.mapDataService.placeTypes$;
  }

  getPlacesFromAPI(types: PlacesType[], location: MapLocation) {
    this.spinner.show();
    this.mapDataService.emptyPlaceTypeDataSet();
    this.googlePalcesService = new google.maps.places.PlacesService(
      this.agmMap
    );
    for (let type of types) {
      if (type.isVisible) {
        const query = {
          location: { lat: location.latitude, lng: location.longitude },
          type: [type.type],
          keyword: [type.keyword],
          rankBy: 1,
        };
        this.googlePalcesService.nearbySearch(
          query,
          (results: any, status: any, pagination: any) => {
            if (status !== 'OK') {
              return;
            }
            this.spinner.hide();
            results.map((res: any) => {
              res['distance'] = this.getDistance(
                { lat: location.latitude, lng: location.longitude },
                {
                  lat: res.geometry.location.lat(),
                  lng: res.geometry.location.lng(),
                }
              );
              return res;
            });
            this.createMarkers(results, type);

            // console.log(type.displayName, results);

            // if(pagination.hasNextPage) {
            //   pagination.nextPage();
            //   this.spinner.show();
            // }
          }
        );
      }
    }
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
      this.mapDataService.updatePlaceTypeData(placeType, {
        latitude: location.lat(),
        longitude: location.lng(),
        name: place.name,
        icon: icon,
        address: place.vicinity,
        rating: place.rating,
        distance: parseFloat((place.distance / 1000).toFixed(3)),
      });
      bounds.extend(place.geometry.location);
    }
    this.agmMap.fitBounds(bounds);
  }

  rad = (x: number) => (x * Math.PI) / 180;

  getDistance = (
    p1: { lat: number; lng: number },
    p2: { lat: number; lng: number }
  ) => {
    var R = 6378137; // Earth’s mean radius in meter
    var dLat = this.rad(p2.lat - p1.lat);
    var dLong = this.rad(p2.lng - p1.lng);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.rad(p1.lat)) *
        Math.cos(this.rad(p2.lat)) *
        Math.sin(dLong / 2) *
        Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d; // returns the distance in meter
  };

  addPlaceType(placeType: PlacesType) {
    this.mapDataService.addPlaceType(placeType);
    if (this.agmMap) {
      this.getPlacesFromAPI(
        this.mapDataService.getPlaceTypes(),
        this.currentLocation
      );
      this.hideSpinner(2000);
    }
  }

  deletePlaceType(placeType: PlacesType) {
    this.mapDataService.deletePlaceType(placeType);
    this.getPlacesFromAPI(
      this.mapDataService.getPlaceTypes(),
      this.currentLocation
    );
    this.hideSpinner(2000);
  }

  updatePlaceTypeVisibility(placeType: string, visible: boolean) {
    this.mapDataService.updatePlaceTypeVisibility(placeType, visible);
    this.getPlacesFromAPI(
      this.mapDataService.getPlaceTypes(),
      this.currentLocation
    );
    this.hideSpinner(2000);
  }

  updatePlaceRating(rating: Ratings, placeType: PlacesType) {
    this.mapDataService.updatePlaceRating(placeType, rating);
  }

  createDefaultPlaceTypes() {
    const filters: any[] = this.storageService.getItem('filters');
    if (!filters) {
      let placeType = new PlacesType('Hospital', true, 'hospital');
      this.addPlaceType(placeType);
      placeType = new PlacesType('Police Station', true, 'police');
      this.addPlaceType(placeType);
      placeType = new PlacesType(
        'Fire Station',
        true,
        undefined,
        'fire station'
      );
      this.addPlaceType(placeType);
      this.storageService.setItem(
        'filters',
        this.mapDataService.getPlaceTypes()
      );
    } else {
      filters.forEach((filter) => {
        this.addPlaceType(filter);
      });
    }
  }

  clearPlacesData() {
    this.mapDataService.emptyPlaceTypeDataSet();
  }

  hideSpinner(timeout: number) {
    setTimeout(() => {
      this.spinner.hide();
    }, timeout);
    if (
      !this.mapDataService
        .getPlaceTypes()
        .some((type) => type.isVisible === true)
    ) {
      // this.zoom = location.zoom;
      setTimeout(() => {
        this.spinner.hide();
      }, timeout);
    }
  }
}
