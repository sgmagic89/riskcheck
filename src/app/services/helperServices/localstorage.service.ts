import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

constructor() { }

setItem(itemKey: string, itemValue: any) {
  localStorage.setItem(itemKey, JSON.stringify(itemValue));
}

getItem(itemKey: string) {
  const data = localStorage.getItem(itemKey);
  if(data) {
    return JSON.parse(data);
  } else {
    return data;
  }
}

removeItem(itemKey: string) {
  localStorage.removeItem(itemKey);
}

clearAll() {
  localStorage.clear();
}

}
