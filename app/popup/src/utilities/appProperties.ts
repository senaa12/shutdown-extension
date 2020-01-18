import { throws } from 'assert';

class AppProperties {
    constructor() {
        this.isBaseApp = process.env.IS_BASE !== undefined ? JSON.parse(process.env.IS_BASE) : true;
        this.isProduction = process.env.PRODUCTION !== undefined ? JSON.parse(process.env.PRODUCTION) : true;
    }
    public isProduction: boolean;
    public isBaseApp: boolean;

}

const properties = new AppProperties();
export default properties;
