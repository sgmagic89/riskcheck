import { Ratings } from 'src/app/models/rating.enum';
export class EarthQuakeParameters {
  latitude: number = 0;
  longitude: number = 0;
  period: number = 10;
  maxradiuskm?: number = 50;
}

export class EarthQuakeData {
  total: number = 0;
  min?: EarthQuake = {};
  max?: EarthQuake = {};
  lastEarthQuake?: EarthQuake;
  allEarthQuakes?: EarthQuake[];
  period: number = 10;
  rating?: Ratings;
}

export class EarthQuake {
  mag?: number;
  time?: Date;
  latitude?: number;
  longitude?: number;
  depth?: number;
}
