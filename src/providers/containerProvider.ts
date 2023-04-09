import { App } from "../classes/App";
import { Container } from "../classes/Container";
import { Database } from "../classes/Database";
import { UserRepo } from "../api/repo/UserRepo";
import { constants } from "../util/constants";

const config = { // TODO: Provide a proper config.
    app: {
        name: 'Simple Robust API',
        // port: 3000, // TODO
        // logLevel: 'debug', // TODO
        // environment: 'development' // TODO
    },
    database: {
        filename: './to_improve.db',
        type: constants.database.types.SQLITE3
    }
}

const iocContainer = new Container();
iocContainer.service('Database', () => new Database({ ...config.database }));

// Repo's
iocContainer.service('UserRepo', (c) => new UserRepo(c.Database));

// App
iocContainer.service('App', (c) => new App({ ...config.app, database: c.Database }));

export default iocContainer;