import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ManageFiltersComponent } from '../../filters/manage-filters/manage-filters.component';

@Component({
  selector: 'app-sinde-nav',
  templateUrl: './sinde-nav.component.html',
  styleUrls: ['./sinde-nav.component.scss']
})
export class SindeNavComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  openManageFilters() {
    this.dialog.open(ManageFiltersComponent,{
      height: '400px',
      width: '800px'
    });
  }

}
