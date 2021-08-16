import { PlacesType } from "./placesType.model";

export class PlaceTypeData {
    placeType: PlacesType;
    data: any[];
    nearestPlace?: any;
    placesCount?: number;
    constructor(placeType: PlacesType, data: any[] = []) {
        this.placeType = placeType,
        this.data = data
    }
}