import { AgmMap, MapsAPILoader } from '@agm/core';
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { EartQuakeParameters } from 'src/app/models/eartQuakeData.model';
import { PlacesType } from 'src/app/models/placesType.model';
import { ApiService } from 'src/app/services/api.service';
import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
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
  @ViewChild("AgmMap") set content(map: AgmMap) {
    if (map) {
      map.mapReady.subscribe(map => {
        this.agmMap = map;
      });
    }
  }
  constructor(public mapService: MapService, private ngZone: NgZone, private apiServcice: ApiService, private mapsAPILoader: MapsAPILoader) { }

  ngOnInit() {
    this.mapsAPILoader.load().then(() => {
    this.mapService.placeTypes$.subscribe(types => {
        this.mapService.location$.subscribe(location => {
          if(location.latitude && location.longitude) {
            this.ngZone.run(() => {
              this.latitude = location.latitude;
              this.longitude = location.longitude;
              console.log(location);
              if(types.some(type => type.isVisible === true)) {
                this.getPlaces(types, {lat: location.latitude, lng: location.longitude});
              }
              // this.getHazzardInfo();
            });
          }
        });
    });
    });
  }

  getHazzardInfo() {
    let eartQuakeData = new EartQuakeParameters();
        eartQuakeData.endtime = '2021-08-01';
        eartQuakeData.starttime = '2020-08-01';
        eartQuakeData.latitude = this.latitude;
        eartQuakeData.longitude = this.longitude;
        this.apiServcice.getEarthQuakeData(eartQuakeData).subscribe(result => {
          console.log(result);
        })
  }

  getPlaces(types: PlacesType[], location: any) {
    this.mapService.emptyPlaceTypeDataSet();
    this.palcesService = new google.maps.places.PlacesService(this.agmMap);
      for(let type of types) {
        if(type.isVisible) {
          const query = {
            location: location,
            radius: type.radius,
            type: [type.type? type.type : undefined],
            keyword: [type.keyword? type.keyword : undefined]
          }
          this.palcesService.nearbySearch(query,
          (results: any, status: any, pagination: any) => {
              if (status !== 'OK') return;
              this.createMarkers(results, type);
              console.log(results)
              if(pagination.hasNextPage) {
                pagination.nextPage();
              }
          });
        }
      }
  }

  

  createMarkers(places: any, placeType: PlacesType) {
    let bounds = new google.maps.LatLngBounds();
    for (var i = 0, place; place = places[i]; i++) {
      let location = place.geometry.location;
      let icon = {
        url: place.icon,
        scaledSize: {
          width: 24,
          height: 24
        }
      }
      this.mapService.updatePlaceTypeData(placeType,{latitude: location.lat(), longitude: location.lng(), name: place.name, icon: icon})
      bounds.extend(place.geometry.location);
    }
    this.agmMap.fitBounds(bounds);
  }


  isPlaceTypeVisible(placeType: PlacesType) {
    this.mapService.placeTypes$.subscribe(type => {
      return true;
    })
  }
  

}
