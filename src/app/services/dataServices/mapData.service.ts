import { Injectable } from '@angular/core';
import { Model, ModelFactory } from '@angular-extensions/model';
import { Observable } from 'rxjs';
import { PlaceTypeData } from 'src/app/models/placeTypeData.model';
import { PlacesType } from 'src/app/models/placesType.model';
import { LocalstorageService } from '../helperServices/localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class MapDataService {

private placeTypesModel: Model<PlacesType[]>;
placeTypes$: Observable<PlacesType[]>;

private placesDataModel: Model<PlaceTypeData[]>;
placesData$: Observable<PlaceTypeData[]>;

constructor(private modelFactoryPlaceTypeData: ModelFactory<PlaceTypeData[]>,
  private modelFactoryPlaceTypes: ModelFactory<PlacesType[]>,
  private storageService: LocalstorageService) {
  this.placesDataModel = this.modelFactoryPlaceTypeData.create([]);
  this.placesData$ = this.placesDataModel.data$;

  this.placeTypesModel = this.modelFactoryPlaceTypes.create([]);
  this.placeTypes$ = this.placeTypesModel.data$;
}

getPlaceTypes() {
  return this.placeTypesModel.get();
}

addPlaceType(placeType: PlacesType) {
  const placeTypes = this.getPlaceTypes();
  const updatedpPaceTypes = [...placeTypes, placeType];
  this.placeTypesModel.set(updatedpPaceTypes);
  this.storageService.removeItem('filters');
  this.storageService.setItem('filters', updatedpPaceTypes);
}

deletePlaceType(placeType: PlacesType) {
  const placeTypes = this.getPlaceTypes();
  const updatedpPaceTypes = placeTypes.filter(filter => filter.displayName != placeType.displayName);
  this.placeTypesModel.set(updatedpPaceTypes);
  this.storageService.removeItem('filters');
  this.storageService.setItem('filters', updatedpPaceTypes);
}


updatePlaceTypeVisibility(placeType: string, visible: boolean) {
  let placeTypes = this.getPlaceTypes();
  placeTypes.forEach(type => {
    if(type.displayName === placeType) {
      type.isVisible = visible;
    }
  });
  this.placeTypesModel.set(placeTypes);
  this.storageService.removeItem('filters');
  this.storageService.setItem('filters', placeTypes);
}

updatePlaceTypeData(placeType: PlacesType, data: any) {
  const placesData = this.placesDataModel.get();
  const dataExists = placesData.some( type => type.placeType.displayName === placeType.displayName);
  if(dataExists) {
    placesData.forEach( type => {
      if(type.placeType.displayName === placeType.displayName) {
        type.data.push(data);
      }
    });
  } else {
    const placeTypeData = new PlaceTypeData(placeType);
    placeTypeData.data.push(data)
    placesData.push(placeTypeData);
  }
  this.placesDataModel.set(placesData);
}

emptyPlaceTypeDataSet() {
  this.placesDataModel.set([]);
}

}
