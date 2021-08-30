import { Injectable } from '@angular/core';
import { Model, ModelFactory } from '@angular-extensions/model';
import { Observable } from 'rxjs';
import { PlaceTypeData } from 'src/app/models/placeTypeData.model';
import { PlacesType } from 'src/app/models/placesType.model';
import { LocalstorageService } from '../helperServices/localstorage.service';
import { MapLocation } from 'src/app/models/location.model';
import { Ratings } from 'src/app/models/rating.enum';

@Injectable({
  providedIn: 'root',
})
export class MapDataService {
  private locationModel: Model<MapLocation>;
  location$: Observable<MapLocation>;

  private placeTypesModel: Model<PlacesType[]>;
  placeTypes$: Observable<PlacesType[]>;

  private placesDataModel: Model<PlaceTypeData[]>;
  placesData$: Observable<PlaceTypeData[]>;

  constructor(
    private modelFactoryPlaceTypeData: ModelFactory<PlaceTypeData[]>,
    private modelFactoryPlaceTypes: ModelFactory<PlacesType[]>,
    private modelFactoryLocation: ModelFactory<MapLocation>,
    private storageService: LocalstorageService
  ) {
    this.placesDataModel = this.modelFactoryPlaceTypeData.create([]);
    this.placesData$ = this.placesDataModel.data$;

    this.placeTypesModel = this.modelFactoryPlaceTypes.create([]);
    this.placeTypes$ = this.placeTypesModel.data$;

    this.locationModel = this.modelFactoryLocation.create(<MapLocation>{
      longitude: 0,
      latitude: 0,
      zoom: 0,
      address: '',
    });
    this.location$ = this.locationModel.data$;
  }

  initLocation() {
    const location = this.storageService.getItem('currentLocation');
    if (location) {
      this.setLocation(location);
    }
  }

  setLocation(location: MapLocation) {
    this.locationModel.set(location);
    this.storageService.setItem('currentLocation', location);
  }

  clearLocation() {
    this.storageService.removeItem('currentLocation');
    this.locationModel.set(<MapLocation>{
      longitude: 0,
      latitude: 0,
      zoom: 0,
      address: '',
    });
  }

  getPlaceTypes() {
    return this.placeTypesModel.get();
  }

  addPlaceType(placeType: PlacesType) {
    const placeTypes = this.getPlaceTypes();
    let checkForPlaceType = placeTypes.some((place) => {
      if (place.displayName === placeType.displayName) return true;
      else return false;
    });
    if (!checkForPlaceType) {
      const updatedpPaceTypes = [...placeTypes, placeType];
      this.placeTypesModel.set(updatedpPaceTypes);
      this.storageService.removeItem('filters');
      this.storageService.setItem('filters', updatedpPaceTypes);
    }
  }

  deletePlaceType(placeType: PlacesType) {
    const placeTypes = this.getPlaceTypes();
    const updatedpPaceTypes = placeTypes.filter(
      (filter) => filter.displayName != placeType.displayName
    );
    this.placeTypesModel.set(updatedpPaceTypes);
    this.storageService.removeItem('filters');
    this.storageService.setItem('filters', updatedpPaceTypes);
  }

  updatePlaceTypeVisibility(placeType: string, visible: boolean) {
    let placeTypes = this.getPlaceTypes();
    placeTypes.forEach((type) => {
      if (type.displayName === placeType) {
        type.isVisible = visible;
      }
    });
    this.placeTypesModel.set(placeTypes);
    this.storageService.removeItem('filters');
    this.storageService.setItem('filters', placeTypes);
  }

  updatePlaceRating(placeType: PlacesType, rating: Ratings) {
    const placesData = this.placesDataModel.get();
    for (const place of placesData) {
      if (place.placeType.displayName === placeType.displayName) {
        place.rating = rating;
        break;
      }
    }
    this.placesDataModel.set(placesData);
  }

  updatePlaceTypeData(placeType: PlacesType, data: any) {
    const placesData = this.placesDataModel.get();
    const dataExists = placesData.some(
      (type) => type.placeType.displayName === placeType.displayName
    );
    if (dataExists) {
      placesData.forEach((type) => {
        if (type.placeType.displayName === placeType.displayName) {
          if (type.placeType.displayName == 'Hospital') {
            if (data.name.toLocaleLowerCase().includes('hospital')) {
              type.data.push(data);
            }
          } else type.data.push(data);
        }
        type.placesCount = type.data.length;
        type.nearestPlace = this.findNearest([...type.data]);
      });
    } else {
      const placeTypeData = new PlaceTypeData(placeType);
      placeTypeData.data.push(data);
      placesData.push(placeTypeData);
    }
    this.placesDataModel.set(placesData);
  }

  findNearest(data: any) {
    if (data && data.length > 0) {
      data.sort((a: any, b: any) => a.distance - b.distance);
      return data[0].distance;
    }
    return 0;
  }

  emptyPlaceTypeDataSet() {
    this.placesDataModel.set([]);
  }
}
