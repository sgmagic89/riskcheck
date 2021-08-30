import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EarthQuakeParameters } from './models/eartQuakeData.model';
import { HazzardService } from './services/logicalServices/hazzard.service';
import { LocationService } from './services/logicalServices/location.service';
import { PlacesService } from './services/logicalServices/places.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'RiskCheck';
  navVisible = false;
  mapSubscription: Subscription = <Subscription>{};
  hazzarSubscription: Subscription = <Subscription>{};
  isMapVisible = false;
  isSmallMap = false;
  @ViewChild('drawer', { static: true })
  public sidenav: MatSidenav = <MatSidenav>{};
  constructor(
    private locationService: LocationService,
    private placesService: PlacesService,
    private hazzardService: HazzardService,
    private router: Router
  ) {
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        if (val.url === '/configure') {
          this.isSmallMap = true;
        } else {
          this.isSmallMap = false;
        }

        this.locationService.getLocation().subscribe((location) => {
          if (location.address && location.address !== '') {
            this.isMapVisible = true;
          } else {
            this.isMapVisible = false;
          }
          if (val.url === '/analyze') {
            this.isMapVisible = false;
          }
        });
      }
    });
  }
  ngOnInit() {
    this.hazzarSubscription = this.hazzardService
      .getEarthQuakeData()
      .subscribe((data) => {
        // console.log('EarthQuake Data', data);
      });
    this.placesService.createDefaultPlaceTypes();
    this.mapSubscription = this.locationService
      .getLocation()
      .subscribe((location) => {
        if (location.latitude && location.longitude) {
          const params = new EarthQuakeParameters();
          params.latitude = location.latitude;
          params.longitude = location.longitude;
          this.hazzardService.getEarthQuakeDataFromAPI(params);
        }
        if (location.address && location.address !== '') {
          this.isMapVisible = true;
        } else {
          this.isMapVisible = false;
        }
      });
  }
  toogleNav() {
    this.sidenav.toggle();
  }

  closeNav() {
    this.sidenav.close();
  }

  gotoHome() {
    this.router.navigate(['']);
  }
}
