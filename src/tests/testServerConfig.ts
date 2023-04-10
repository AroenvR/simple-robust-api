import { constants } from "../util/constants";

export const testServerConfig = { // TODO: Provide a proper serverConfig.
    app: {
        name: 'Test App',
        port: 1337,
    },
    database: {
        filename: ':memory:',
        type: constants.database.types.SQLITE3
    },
    tasks: {
        timeout: 50
    }
}