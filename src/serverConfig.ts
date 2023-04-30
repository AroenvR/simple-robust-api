import { IServerConfig } from "./interfaces/IServerConfig";

export const serverConfig: IServerConfig = { // TODO: Provide a proper serverConfig.
    app: {
        name: 'Simple Robust API',
        port: 3000,
        // logLevel: 'debug', // TODO
        // environment: 'development' // TODO
        corsConfig: {
            originAllowList: [
                `http://curl.home`,
            ]
        }
    },
    database: {
        filename: ':memory:',
        type: 'sqlite3'
    },
    logger: {
        level: "debug",
        console: true,
        http: true,
        file: true,
    },
    tasks: {
        timeout: 500
    }
}