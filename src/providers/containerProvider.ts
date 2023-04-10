import App from "../classes/App";
import { Container } from "../classes/Container";
import { Database } from "../classes/Database";
import { UserRepo } from "../api/repo/UserRepo";
import { constants } from "../util/constants";
import { TaskProcessor } from "../util/TaskProcessor";
import { PubSub } from "../util/PubSub";
import { UserService } from "../api/service/UserService";
import { serverConfig } from "../serverConfig";
import { UserController } from "../api/controller/UserController";
import { IContainerConfig } from "../interfaces/IContainerConfig";
import { RouteInitEvent } from "../util/RouteInitEvent";

const config: IContainerConfig = {
    database: { ...serverConfig.database },
    app: { ...serverConfig.app },
    tasks: { ...serverConfig.tasks },
}
const iocContainer = new Container(config);

// Util
iocContainer.register(RouteInitEvent, () => new RouteInitEvent());
iocContainer.register(PubSub, (c) => new PubSub());
iocContainer.register(TaskProcessor, (c) => new TaskProcessor({ ...c.getConfiguration().tasks }));

// Database
iocContainer.register(Database, (c) => new Database({ ...c.getConfiguration().database }));

// Repo's
iocContainer.register(UserRepo, (c) => new UserRepo(c.get(Database)));

// Services
iocContainer.register(UserService, (c) => new UserService(c.get(UserRepo), c.get(TaskProcessor), c.get(PubSub)));

// Controllers
iocContainer.register(UserController, (c) => new UserController(c.get(UserService), c.get(RouteInitEvent)));

// App
iocContainer.register(App, (c) => new App({ ...c.getConfiguration().app, database: c.get(Database), routeInitEvent: c.get(RouteInitEvent) }));

export default iocContainer;