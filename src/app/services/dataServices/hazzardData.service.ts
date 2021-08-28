import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { EarthQuakeData, EarthQuakeParameters } from 'src/app/models/eartQuakeData.model';
import { Model, ModelFactory } from '@angular-extensions/model';
import { switchMap } from 'rxjs/operators';
import { ApiService } from '../helperServices/api.service';

@Injectable({
  providedIn: 'root'
})
export class HazzardDataService {
earthQuakeDataBaseUrl = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson';

private earthQuakeDataModel: Model<EarthQuakeData>;
earthQuakeData$: Observable<EarthQuakeData>;

constructor(private eartQuakeDataModelFactory: ModelFactory<EarthQuakeData>, private apiService: ApiService) {
  this.earthQuakeDataModel = this.eartQuakeDataModelFactory.create(<EarthQuakeData>{});
  this.earthQuakeData$ = this.earthQuakeDataModel.data$;
}

setEarthQuakeData(data: EarthQuakeData) {
  this.earthQuakeDataModel.set(data);
}

public getEarthQuakeData(params: EarthQuakeParameters) {
  let url = this.earthQuakeDataBaseUrl + this.apiService.getQueryString(params);
  this.apiService.get(url).subscribe( data => {
    this.setEarthQuakeData(this.parseEartQuakeData(data));
  });
}

private parseEartQuakeData(data: any): EarthQuakeData {
  let earthQuakeData: EarthQuakeData = new EarthQuakeData();
  if(data.features.length) {
      let lastEartQuake = data.features.sort((a: any, b: any) => {
        if (a.properties.time < b.properties.time) {
          return -1;
        }
        if (a.properties.time > b.properties.time) {
          return 1;
        }
        return 0;
      });
      lastEartQuake = {
        mag: lastEartQuake[lastEartQuake.length - 1].properties.mag,
        time: new Date(lastEartQuake[lastEartQuake.length - 1].properties.time)
      }
      let minMaxData = data.features.sort((a: any, b: any) => {
        if (a.properties.mag < b.properties.mag) {
          return -1;
        }
        if (a.properties.mag > b.properties.mag) {
          return 1;
        }
        return 0;
      });
      earthQuakeData = {
        total: minMaxData.length,
        min: {
          mag: minMaxData[0].properties.mag,
          time: new Date(minMaxData[0].properties.time),
        },
        max: {
          mag: minMaxData[minMaxData.length - 1].properties.mag,
          time: new Date(minMaxData[minMaxData.length - 1].properties.time),
        },
        lastEarthQuake: lastEartQuake
      };
    }
    return earthQuakeData;
}

}
