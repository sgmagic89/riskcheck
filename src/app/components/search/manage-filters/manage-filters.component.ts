import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PlacesType } from 'src/app/models/placesType.model';
import { MapService } from 'src/app/services/map.service';
import { AddFilterComponent } from '../add-filter/add-filter.component';

@Component({
  selector: 'app-manage-filters',
  templateUrl: './manage-filters.component.html',
  styleUrls: ['./manage-filters.component.scss']
})
export class ManageFiltersComponent implements OnInit {
  displayedColumns: string[] = ['displayName', 'keyword', 'isVisible', 'radius', 'canDelete'];
  dataSource: PlacesType[] = [];
  constructor(private mapService: MapService, public dialog: MatDialog,     private dialogRef: MatDialogRef<ManageFiltersComponent>,) { }

  ngOnInit() {
    this.mapService.placeTypes$.subscribe(placeTypes => {
      this.dataSource = placeTypes;
    })
  }

  addFilter() {
    this.dialog.open(AddFilterComponent);
  }

  delete(element: PlacesType) {
    this.mapService.deletePlaceType(element);
  }

  close() {
    this.dialogRef.close();
  }

}
