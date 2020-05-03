class AppProperties {
    constructor() {
        this.isProduction = process.env.PRODUCTION !== undefined ? JSON.parse(process.env.PRODUCTION) : false;
    }
    public isProduction: boolean;
}

const properties = new AppProperties();
export default properties;
