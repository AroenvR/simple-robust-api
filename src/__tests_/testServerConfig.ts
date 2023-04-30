import { IServerConfig } from "../interfaces/IServerConfig";
import { constants } from "../util/constants";

export const testServerConfig: IServerConfig = {
    app: {
        name: 'Test App',
        port: 1337,
        corsConfig: {
            originAllowList: [
                `http://localhost:3000`,
                `http://test.com`
            ]
        }
    },
    database: {
        filename: ':memory:',
        type: constants.database.types.SQLITE3
    },
    logger: {
        level: "debug",
        console: true,
        http: true,
        file: true,
    },
    tasks: {
        timeout: 50
    }
}