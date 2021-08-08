import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import {Location} from '@angular-material-extensions/google-maps-autocomplete';
import { PlacesType } from '../models/placesType.model';
import { PlaceTypeData } from '../models/placeTypeData.model';
import { LocalstorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class MapService {

private _location = new BehaviorSubject<Location>(<Location>{});
location$ = this._location.asObservable();

private _placeTypes = new BehaviorSubject<PlacesType[]>([]);
placeTypes$ = this._placeTypes.asObservable();

private placeTypeDataSet: PlaceTypeData[] = [];
private _placeTypeDataSet = new Subject<PlaceTypeData[]>();
placeTypeDataSet$ = this._placeTypeDataSet.asObservable();

constructor(private storageService: LocalstorageService) { }

setLocation(location: Location) {
  this._location.next(location);
}

addPlaceType(placeType: PlacesType) {
  const placeTypes = this._placeTypes.getValue();
  const updatedpPaceTypes = [...placeTypes, placeType];
  this._placeTypes.next(updatedpPaceTypes);
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
    placeType = new PlacesType('Police Station',false,'police',undefined);
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

}
