import { Ratings } from 'src/app/models/rating.enum';
import { NgxSpinnerService } from 'ngx-spinner';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  EarthQuake,
  EarthQuakeData,
  EarthQuakeParameters,
} from 'src/app/models/eartQuakeData.model';
import { Model, ModelFactory } from '@angular-extensions/model';
import { ApiService } from '../helperServices/api.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class HazzardDataService {
  earthQuakeDataBaseUrl =
    'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson';

  private earthQuakeDataModel: Model<EarthQuakeData>;
  earthQuakeData$: Observable<EarthQuakeData>;

  constructor(
    private eartQuakeDataModelFactory: ModelFactory<EarthQuakeData>,
    private apiService: ApiService,
    private spinner: NgxSpinnerService
  ) {
    this.earthQuakeDataModel = this.eartQuakeDataModelFactory.create(
      <EarthQuakeData>{}
    );
    this.earthQuakeData$ = this.earthQuakeDataModel.data$;
  }

  setEarthQuakeData(data: EarthQuakeData) {
    this.earthQuakeDataModel.set(data);
  }

  public getEarthQuakeData(params: EarthQuakeParameters) {
    this.spinner.show('geodataspinner');
    const queryParams: any = {};
    queryParams['latitude'] = params.latitude;
    queryParams['longitude'] = params.longitude;
    queryParams['latitude'] = params.latitude;
    queryParams['maxradiuskm'] = params.maxradiuskm;
    queryParams['starttime'] = moment()
      .subtract(params.period, 'years')
      .format('YYYY-MM-DD');
    queryParams['endtime'] = moment().format('YYYY-MM-DD');
    let url =
      this.earthQuakeDataBaseUrl + this.apiService.getQueryString(queryParams);
    this.apiService.get(url).subscribe((data) => {
      this.setEarthQuakeData(this.parseEartQuakeData(data, params.period));
      this.spinner.hide('geodataspinner');
    });
  }

  private parseEartQuakeData(data: any, period: number): EarthQuakeData {
    let earthQuakeData: EarthQuakeData = new EarthQuakeData();
    let sortedEarthQuakeDataByTime: any[] = [];
    const formatedAllEarthQuakeData: EarthQuake[] = [];
    let lastEarthQuake: EarthQuake;

    // sort the earth quake data
    if (data.features.length) {
      sortedEarthQuakeDataByTime = data.features.sort((a: any, b: any) => {
        if (a.properties.time < b.properties.time) {
          return -1;
        }
        if (a.properties.time > b.properties.time) {
          return 1;
        }
        return 0;
      });

      //find the latest earth quake
      lastEarthQuake = {
        mag: sortedEarthQuakeDataByTime[sortedEarthQuakeDataByTime.length - 1]
          .properties.mag,
        time: new Date(
          sortedEarthQuakeDataByTime[
            sortedEarthQuakeDataByTime.length - 1
          ].properties.time
        ),
        longitude:
          sortedEarthQuakeDataByTime[sortedEarthQuakeDataByTime.length - 1]
            .geometry.coordinates[0],
        latitude:
          sortedEarthQuakeDataByTime[sortedEarthQuakeDataByTime.length - 1]
            .geometry.coordinates[1],
        depth:
          sortedEarthQuakeDataByTime[sortedEarthQuakeDataByTime.length - 1]
            .geometry.coordinates[2],
      };

      // Store all earth quake data by taking the required fields from response
      sortedEarthQuakeDataByTime.forEach((data) => {
        formatedAllEarthQuakeData.push({
          mag: data.properties.mag,
          time: new Date(data.properties.time),
          longitude: data.geometry.coordinates[0],
          latitude: data.geometry.coordinates[1],
          depth: data.geometry.coordinates[2],
        });
      });

      // sort earthquake data by magnitude to find min max earth quake
      let minMaxData = data.features.sort((a: any, b: any) => {
        if (a.properties.mag < b.properties.mag) {
          return -1;
        }
        if (a.properties.mag > b.properties.mag) {
          return 1;
        }
        return 0;
      });

      // create the response
      earthQuakeData = {
        total: minMaxData.length,
        min: {
          mag: minMaxData[0].properties.mag,
          time: new Date(minMaxData[0].properties.time),
          longitude: minMaxData[0].geometry.coordinates[0],
          latitude: minMaxData[0].geometry.coordinates[1],
          depth: minMaxData[0].geometry.coordinates[2],
        },
        max: {
          mag: minMaxData[minMaxData.length - 1].properties.mag,
          time: new Date(minMaxData[minMaxData.length - 1].properties.time),
          longitude: minMaxData[minMaxData.length - 1].geometry.coordinates[0],
          latitude: minMaxData[minMaxData.length - 1].geometry.coordinates[1],
          depth: minMaxData[minMaxData.length - 1].geometry.coordinates[2],
        },
        lastEarthQuake: lastEarthQuake,
        allEarthQuakes: formatedAllEarthQuakeData,
        period: period,
      };
    }
    return earthQuakeData;
  }

  updateRating(rating: Ratings) {
    const data = this.earthQuakeDataModel.get();
    data.rating = rating;
    this.earthQuakeDataModel.set(data);
  }
}
