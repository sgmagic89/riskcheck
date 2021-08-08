import { AgmMap} from '@agm/core';
import { AfterViewInit, Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { EartQuakeParameters } from 'src/app/models/eartQuakeData.model';
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
  @ViewChild('AgmMap') agmMap: AgmMap = <AgmMap>{};
  constructor(private mapService: MapService, private ngZone: NgZone, private apiServcice: ApiService) { }

  ngOnInit() {
    this.mapService.location$.subscribe(location => {
      this.ngZone.run(() => {
        this.latitude = location.latitude;
        this.longitude = location.longitude;
        console.log(location);
        let eartQuakeData = new EartQuakeParameters();
        eartQuakeData.endtime = '2021-08-01';
        eartQuakeData.starttime = '2020-08-01';
        eartQuakeData.latitude = this.latitude;
        eartQuakeData.longitude = this.longitude;
        this.apiServcice.getEarthQuakeData(eartQuakeData).subscribe(result => {
          console.log(result);
        })
        this.zoom = 15;
      });
    });
  }
  

}
