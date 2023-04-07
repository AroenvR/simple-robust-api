import { App } from "../classes/App";
import { Container } from "../classes/Container";
import { Database } from "../classes/Database";
import { UserRepo } from "../repo/UserRepo";

const iocContainer = new Container();
iocContainer.service('Database', () => new Database({ filename: './to_improve.db' }));

// Repo's
iocContainer.service('UserRepo', (c) => new UserRepo(c.Database));

// App
iocContainer.service('App', (c) => new App({ name: 'Simple Robust API', database: c.Database }));

export default iocContainer;