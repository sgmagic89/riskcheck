import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import {Location} from '@angular-material-extensions/google-maps-autocomplete';
import { PlacesType } from '../models/placesType.model';
import { PlaceTypeData } from '../models/placeTypeData.model';

@Injectable({
  providedIn: 'root'
})
export class MapService {

private _location = new Subject<Location>();
location$ = this._location.asObservable();

private _placeTypes = new BehaviorSubject<PlacesType[]>([]);
placeTypes$ = this._placeTypes.asObservable();

private placeTypeDataSet: PlaceTypeData[] = [];
private _placeTypeDataSet = new Subject<PlaceTypeData[]>();
placeTypeDataSet$ = this._placeTypeDataSet.asObservable();

constructor() { }

setLocation(location: Location) {
  this._location.next(location);
}

setPlaceType(placeType: PlacesType) {
  const placeTypes = this._placeTypes.getValue();
  const updatedValue = [...placeTypes, placeType];
  this._placeTypes.next(updatedValue);
}

updatePlaceTypeVisibility(placeType: string, visible: boolean) {
  let placeTypes = this._placeTypes.getValue();
  placeTypes.forEach(type => {
    if(type.displayName === placeType) {
      type.isVisible = visible;
    }
  });
  this._placeTypes.next(placeTypes);
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
  let placeType = new PlacesType('Hospital',false,'hospital');
  this.setPlaceType(placeType);
  placeType = new PlacesType('Police Station',false,'police',undefined);
  this.setPlaceType(placeType);
  placeType = new PlacesType('Fire Station',false,undefined,'fire station');
  this.setPlaceType(placeType);
}

emptyPlaceTypeDataSet() {
  this.placeTypeDataSet.length = 0;
  this._placeTypeDataSet.next(this.placeTypeDataSet);
}

}
