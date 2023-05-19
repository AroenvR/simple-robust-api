import { IServerConfig } from "./IServerConfig";

export const serverConfig: IServerConfig = { // TODO: Provide a proper serverConfig.
    app: {
        name: 'Simple Robust API',
        port: 3000,
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
    logging: {
        level: "debug",
        console: true,
        http: true,
        file: true,
    },
    tasks: {
        timeout: 500
    }
}