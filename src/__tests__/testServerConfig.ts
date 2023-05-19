import path from 'path';
import { IServerConfig } from "../IServerConfig";
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
        driver: constants.database.types.SQLITE3
    },
    logging: {
        level: "debug",
        console: false,
        http: false,
        file: true,
        filePath: path.join(__dirname, './logs', `${new Date().toISOString().replace(/[:.]/g, '-')}.log`),
    },
    tasks: {
        timeout: 50
    }
}