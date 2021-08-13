import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EartQuakeParameters } from '../models/eartQuakeData.model';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  earthQuakeDataBaseUrl =
    'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson';
  constructor(private http: HttpClient) {}

  private get(url: string, options?: any) {
    return this.http.get(url, options);
  }

  private post(url: string, data: any, options?: any) {
    return this.http.post(url, data, options);
  }

  getQueryString(data: any): string {
    let queryString = '';
    let keys: string[] = Object.keys(data);
    keys.forEach((key) => {
      queryString += '&' + key + '=' + data[key];
    });
    return queryString;
  }

  public getEarthQuakeData(params: EartQuakeParameters) {
    let url = this.earthQuakeDataBaseUrl + this.getQueryString(params);
    return this.get(url).pipe(
      switchMap((data: any) => {
        data = data.features.sort((a: any, b: any) => {
          if (a.properties.mag < b.properties.mag) {
            return -1;
          }
          if (a.properties.mag > b.properties.mag) {
            return 1;
          }
          return 0;
        });
        let changeData = {
          total: data.length,
          min: {
            mag: data[0].properties.mag,
            time: new Date(data[0].properties.time),
          },
          max: {
            mag: data[data.length - 1].properties.mag,
            time: new Date(data[data.length - 1].properties.time),
          },
        };
        return of(changeData);
      })
    );
  }
}
