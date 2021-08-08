import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PlacesType } from 'src/app/models/placesType.model';
import { MapService } from 'src/app/services/map.service';
import { AddFilterComponent } from '../add-filter/add-filter.component';

@Component({
  selector: 'app-search-filters',
  templateUrl: './search-filters.component.html',
  styleUrls: ['./search-filters.component.scss']
})
export class SearchFiltersComponent implements OnInit {

  constructor(public mapService: MapService, public dialog: MatDialog) { }

  ngOnInit() {
  }

  tooglePlaceType(event: any, type: PlacesType) {
    console.log(event.checked, type);
    this.mapService.updatePlaceTypeVisibility(type.displayName, event.checked);
  }

  openAddFilterForm() {
    const dialogRef = this.dialog.open(AddFilterComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
