import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PlacesType } from 'src/app/models/placesType.model';
import { PlacesService } from 'src/app/services/logicalServices/places.service';
import { AddFilterComponent } from '../add-filter/add-filter.component';

@Component({
  selector: 'app-manage-filters',
  templateUrl: './manage-filters.component.html',
  styleUrls: ['./manage-filters.component.scss']
})
export class ManageFiltersComponent implements OnInit {
  displayedColumns: string[] = ['displayName', 'type', 'keyword', 'isVisible', 'radius', 'canDelete'];
  dataSource: PlacesType[] = [];
  constructor(private placesService: PlacesService, 
    public dialog: MatDialog, 
    private dialogRef: MatDialogRef<ManageFiltersComponent>,) { }

  ngOnInit() {
    this.placesService.placeTypes$.subscribe(placeTypes => {
      this.dataSource = placeTypes;
    })
  }

  addFilter() {
    this.dialog.open(AddFilterComponent);
  }

  delete(element: PlacesType) {
    this.placesService.deletePlaceType(element);
  }

  close() {
    this.dialogRef.close();
  }

}
