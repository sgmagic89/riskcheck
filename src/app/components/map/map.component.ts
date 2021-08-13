import { AgmMap, MapsAPILoader } from '@agm/core';
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { EartQuakeParameters } from 'src/app/models/eartQuakeData.model';
import { PlacesType } from 'src/app/models/placesType.model';
import { ApiService } from 'src/app/services/api.service';
import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  latitude: number = 0;
  longitude: number = 0;
  zoom: number = 5;
  agmMap: any;
  palcesService: any;
  hospitals: any[] = [];
  policeStations: any[] = [];
  fireStations: any[] = [];
  @ViewChild('AgmMap') set content(map: AgmMap) {
    if (map) {
      map.mapReady.subscribe((map) => {
        this.agmMap = map;
      });
    }
  }
  constructor(
    public mapService: MapService,
    private ngZone: NgZone,
    private apiServcice: ApiService,
    private mapsAPILoader: MapsAPILoader,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.mapsAPILoader.load().then(() => {
      this.mapService.placeTypes$.subscribe((types) => {
        this.mapService.location$.subscribe((location) => {
          if (location.latitude && location.longitude) {
            this.ngZone.run(() => {
              this.latitude = location.latitude;
              this.longitude = location.longitude;
              console.log('Location Coordinates', location);
              this.getPlaces(types, {
                lat: location.latitude,
                lng: location.longitude,
              });
              setTimeout(() => {
                this.spinner.hide();
              }, 1000);
              if (!types.some((type) => type.isVisible === true)) {
                this.zoom = 14;
                setTimeout(() => {
                  this.spinner.hide();
                }, 1000);
              }
              this.getHazzardInfo();
            });
          }
        });
      });
    });
  }

  getHazzardInfo() {
    let eartQuakeData = new EartQuakeParameters();
    eartQuakeData.endtime = '2021-08-01';
    eartQuakeData.starttime = '2010-08-01';
    eartQuakeData.latitude = this.latitude;
    eartQuakeData.longitude = this.longitude;
    this.apiServcice.getEarthQuakeData(eartQuakeData).subscribe((result) => {
      console.log('EarthQuake Data', result);
    });
  }

  getPlaces(types: PlacesType[], location: any) {
    this.spinner.show();
    this.mapService.emptyPlaceTypeDataSet();
    this.palcesService = new google.maps.places.PlacesService(this.agmMap);
    for (let type of types) {
      if (type.isVisible) {
        const query = {
          location: location,
          type: [type.type],
          keyword: [type.keyword],
          rankBy:1
        };
        this.palcesService.nearbySearch(
          query,
          (results: any, status: any, pagination: any) => {
            if (status !== 'OK') {
              return;
            }
            this.spinner.hide();
            this.createMarkers(results, type);
            results.map((res:any)=>{
              res["distance"]=this.getDistance({lat:this.latitude, lng:this.longitude}, {lat:res.geometry.location.lat(),lng:res.geometry.location.lng()} )
              return res;
            })
            // results.sort((a: any, b: any) => {
            //   if (a.distance < b.distance) {
            //     return -1;
            //   }
            //   if (a.distance > b.distance) {
            //     return 1;
            //   }
            //   return 0;
            // });
            console.log(type.displayName, results);

            // if(pagination.hasNextPage) {
            //   pagination.nextPage();
            //   this.spinner.show();
            // }
          }
        );
      }
    }
  }

  createMarkers(places: any, placeType: PlacesType) {
    let bounds = new google.maps.LatLngBounds();
    for (var i = 0, place; (place = places[i]); i++) {
      let location = place.geometry.location;
      let icon = {
        url: place.icon,
        scaledSize: {
          width: 24,
          height: 24,
        },
      };
      this.mapService.updatePlaceTypeData(placeType, {
        latitude: location.lat(),
        longitude: location.lng(),
        name: place.name,
        icon: icon,
      });
      bounds.extend(place.geometry.location);
    }
    this.agmMap.fitBounds(bounds);
  }

  isPlaceTypeVisible(placeType: PlacesType) {
    this.mapService.placeTypes$.subscribe((type) => {
      return true;
    });
  }
  rad = (x:number)=> x * Math.PI / 180;
  
  getDistance = (p1:{lat:number,lng:number}, p2:{lat:number,lng:number})=> {
    var R = 6378137; // Earth’s mean radius in meter
    var dLat = this.rad(p2.lat - p1.lat);
    var dLong = this.rad(p2.lng - p1.lng);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.rad(p1.lat)) * Math.cos(this.rad(p2.lat)) *
      Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d; // returns the distance in meter
  };
}
