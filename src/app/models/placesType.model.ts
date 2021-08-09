export class PlacesType {
    displayName: string;
    isVisible: boolean;
    keyword: string;
    radius: number;
    canDelete: boolean;
    constructor(displayName: string, keyword: string, isVisible: boolean=true, canDelete = true, radius = 5000) {
        this.displayName = displayName;
        this.isVisible = isVisible;
        this.keyword = keyword;
        this.radius = radius;
        this.canDelete = canDelete;
    }
}