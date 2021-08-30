import { ManageFiltersComponent } from 'src/app/components/filters/manage-filters/manage-filters.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent implements OnInit {
  constructor(public dialog: MatDialog) {}

  ngOnInit() {}

  openManageFilters() {
    this.dialog.open(ManageFiltersComponent, {
      height: '400px',
      width: '800px',
    });
  }
}
