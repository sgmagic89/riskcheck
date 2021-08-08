export class PlacesType {
    displayName: string;
    isVisible: boolean;
    type?: string;
    keyword?: string;
    radius: number;
    constructor(displayName: string, isVisible: boolean, type?: string, keyword?: string, raius = 1000) {
        this.displayName = displayName;
        this.isVisible = isVisible;
        this.type = type;
        this.keyword = keyword;
        this.radius = raius;
    }
}