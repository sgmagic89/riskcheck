import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PlacesType } from 'src/app/models/placesType.model';
import { MapDataService } from 'src/app/services/dataServices/mapData.service';
import { PlacesService } from 'src/app/services/logicalServices/places.service';
import { AddFilterComponent } from '../add-filter/add-filter.component';

@Component({
  selector: 'app-search-filters',
  templateUrl: './search-filters.component.html',
  styleUrls: ['./search-filters.component.scss']
})
export class SearchFiltersComponent implements OnInit {

  constructor(public placesService: PlacesService, public mapDataService: MapDataService, public dialog: MatDialog) { }

  ngOnInit() {
  }

  tooglePlaceType(event: any, type: PlacesType) {
    this.placesService.updatePlaceTypeVisibility(type.displayName, event.checked);
  }

  openAddFilterForm() {
    this.dialog.open(AddFilterComponent);
  }

}
