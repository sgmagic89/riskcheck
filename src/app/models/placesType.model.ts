export class PlacesType {
    displayName: string;
    isVisible: boolean;
    canDelete: boolean;
    type?: string;
    keyword?: string;
    constructor(displayName: string, isVisible: boolean, type?: string, keyword?: string, canDelete = false) {
        this.displayName = displayName;
        this.isVisible = isVisible;
        this.type = type;
        this.keyword = keyword;
        this.canDelete = canDelete;
    }
}