import { constants } from "./util/constants";

export const serverConfig = { // TODO: Provide a proper serverConfig.
    app: {
        name: 'Simple Robust API',
        port: 3000,
        // logLevel: 'debug', // TODO
        // environment: 'development' // TODO
    },
    database: {
        filename: './to_improve.db',
        type: 'sqlite3'
    }
}