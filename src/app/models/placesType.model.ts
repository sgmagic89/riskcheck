export class PlacesType {
    displayName: string;
    isVisible: boolean;
    type?: string;
    keyword?: string;
    radius: number;
    constructor(displayName: string, isVisible: boolean, type?: string, keyword?: string, radius = 5000) {
        this.displayName = displayName;
        this.isVisible = isVisible;
        this.type = type;
        this.keyword = keyword;
        this.radius = radius;
    }
}