import { Subscription, combineLatest } from 'rxjs';
import { HazzardService } from 'src/app/services/logicalServices/hazzard.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LocationService } from 'src/app/services/logicalServices/location.service';
import { PlacesService } from 'src/app/services/logicalServices/places.service';
import { AddFilterComponent } from '../add-filter/add-filter.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
subscription: Subscription = <Subscription>{};
  constructor(private placesService: PlacesService, 
    public locationService: LocationService,
    private hazardService: HazzardService,
    private router: Router,
    private dialog: MatDialog,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.placesService.mapInitialized$.subscribe(initialized => {
      if(initialized) {
        this.placesService.analyseLocation();
      }
    });
  }

  openAddFilterForm() {
    this.dialog.open(AddFilterComponent);
  }

  search() {
    this.router.navigate(['search']);
  }

  generateReport(){
    this.subscription = combineLatest([
      this.placesService.getPlacesData(),
      this.hazardService.getEarthQuakeData()
    ]).subscribe(result => {
      const placesData = result[0];
      const earthQuakeData = result[1];
      if(placesData.some(place => place.rating === undefined) || earthQuakeData.rating === undefined) {
        this.toastr.error('Please submit all ratings!!');
      } else {
        this.router.navigate(["analyze"])
      }
    });
    setTimeout(()=> {
      if(this.subscription) {
        this.subscription.unsubscribe();
      }
    }, 500);
  }
}
