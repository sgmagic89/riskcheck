export class PlacesType {
    displayName: string;
    isVisible: boolean;
    type?: string;
    keyword?: string;
    radius: number;
    canDelete: boolean;
    constructor(displayName: string, isVisible: boolean, type?: string, keyword?: string, canDelete = false, radius = 5000) {
        this.displayName = displayName;
        this.isVisible = isVisible;
        this.type = type;
        this.keyword = keyword;
        this.radius = radius;
        this.canDelete = canDelete;
    }
}