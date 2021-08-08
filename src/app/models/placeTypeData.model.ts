import { PlacesType } from "./placesType.model";

export class PlaceTypeData {
    placeType: PlacesType;
    data: any[];
    constructor(placeType: PlacesType, data: any[] = []) {
        this.placeType = placeType,
        this.data = data
    }
}