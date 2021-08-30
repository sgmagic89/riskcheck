import { Ratings } from './../../../models/rating.enum';
import { PlaceTypeData } from 'src/app/models/placeTypeData.model';
import { Component, OnInit } from '@angular/core';
import { PlacesType } from 'src/app/models/placesType.model';
import { PlacesService } from 'src/app/services/logicalServices/places.service';

@Component({
  selector: 'app-search-filters',
  templateUrl: './search-filters.component.html',
  styleUrls: ['./search-filters.component.scss']
})
export class SearchFiltersComponent implements OnInit {
  placesData: PlaceTypeData[] = [];
  ratings = Ratings;
  constructor(public placesService: PlacesService) { }

  ngOnInit() {
    this.placesService.getPlacesData().subscribe(placesData => {
      this.placesData = placesData;
    });
  }

  tooglePlaceType(event: any, type: PlacesType) {
    this.placesService.updatePlaceTypeVisibility(type.displayName, event.checked);
  }

  getTotal(placeType: PlacesType) {
    const placeData = this.placesData.filter(place => place.placeType.displayName === placeType.displayName);
    if(placeData.length>0) {
      return [placeData[0].placesCount];
    } else {
      return 0;
    }
  }

  getNearest(placeType: PlacesType) {
    const placeData = this.placesData.filter(place => place.placeType.displayName === placeType.displayName);
    if(placeData.length>0) {
      return [placeData[0].nearestPlace];
    } else {
      return null;
    }
  }

  rate(rating: Ratings, type: PlacesType) {
    this.placesService.updatePlaceRating(rating, type);
  }

  isSelected(rating: Ratings, placeType: PlacesType) {
    const place = this.placesData.filter(place => place.placeType.displayName === placeType.displayName);
    if(place && place.length > 0 && place[0].rating === rating) {
      return true
    } else {
      return false;
    }
  }

}
