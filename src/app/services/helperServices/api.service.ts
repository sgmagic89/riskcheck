import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EarthQuake, EarthQuakeData, EarthQuakeParameters } from '../../models/eartQuakeData.model';
import { switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ApiService {

  constructor(private http: HttpClient) {}

  public get(url: string, options?: any) {
    return this.http.get(url, options);
  }

  public post(url: string, data: any, options?: any) {
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
  
}
