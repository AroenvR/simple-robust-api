import { App } from "../classes/App";
import { Container } from "../classes/Container";
import { Database } from "../classes/Database";
import { UserRepo } from "../api/repo/UserRepo";
import { constants } from "../util/constants";
import { TaskProcessor } from "../util/TaskProcessor";
import { PubSub } from "../util/PubSub";
import { UserService } from "../api/service/UserService";

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
// Util
iocContainer.service('TaskProcessor', () => new TaskProcessor());
iocContainer.service('PubSub', () => new PubSub());

// Database
iocContainer.service('Database', () => new Database({ ...config.database }));

// Repo's
iocContainer.service('UserRepo', (c) => new UserRepo(c.Database));

// Services
iocContainer.service('UserService', (c) => new UserService(c.UserRepo, c.TaskProcessor, c.PubSub));

// App
iocContainer.service('App', (c) => new App({ ...config.app, database: c.Database }));

export default iocContainer;