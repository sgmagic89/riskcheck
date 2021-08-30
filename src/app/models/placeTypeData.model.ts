import { PlacesType } from "./placesType.model";
import { Ratings } from "./rating.enum";

export class PlaceTypeData {
    placeType: PlacesType;
    data: any[];
    nearestPlace?: any;
    placesCount?: number;
    rating?: Ratings;
    constructor(placeType: PlacesType, data: any[] = []) {
        this.placeType = placeType,
        this.data = data
    }
}