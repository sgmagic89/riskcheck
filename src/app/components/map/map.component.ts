import { AgmMap} from '@agm/core';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
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
  constructor(private mapService: MapService) { }

  ngOnInit() {
    this.mapService.location$.subscribe(location => {
      this.latitude = location.latitude;
      this.longitude = location.longitude;
    })
  }

}
