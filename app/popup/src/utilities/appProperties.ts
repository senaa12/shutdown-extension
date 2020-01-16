class AppProperties {
    constructor() {
        this.isVideoAppModeIncluded = true;
    }

    private isVideoAppModeIncluded: boolean;
    public PremiumAppMode() {
        return this.isVideoAppModeIncluded;
    }
}

const properties = new AppProperties();
export default properties;
