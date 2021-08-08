import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {Location} from '@angular-material-extensions/google-maps-autocomplete';

@Injectable({
  providedIn: 'root'
})
export class MapService {

private _location = new Subject<Location>();
location$ = this._location.asObservable();
constructor() { }

setLocation(location: Location) {
  this._location.next(location);
}

}
