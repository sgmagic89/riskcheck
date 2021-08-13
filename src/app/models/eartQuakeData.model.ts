export class EarthQuakeParameters {
    latitude: number = 0;
    longitude: number = 0; 
    starttime?: string = '2010-08-01';
    endtime?: string = '2021-08-13';
    maxradiuskm?: number = 50;
}

export class EarthQuakeData {
    total: number = 0;
    min?: EarthQuake = {};
    max?: EarthQuake = {};
    lastEarthQuake?: EarthQuake;
}

export class EarthQuake {
    mag?: number;
    time?: Date;
}
