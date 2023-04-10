import { UserController } from "../api/controller/UserController";
import { constants } from "../util/constants";
import express from 'express';
import iocContainer from "./containerProvider";
import { isTruthy } from "../util/isTruthy";
import { LogLevel, logger } from "../util/logger";
import { serverConfig } from "../serverConfig";
import cors from 'cors';

const app = express();

app.options('*', cors());
app.use(express.json());
app.listen(serverConfig.app.port, () => console.log(`App running on: http://localhost:${serverConfig.app.port}/`));

app.get('/users', async (req: any, res: any) => {
    res.setHeader('Access-Control-Allow-Origin', serverConfig.app.port); // TODO: Config

    logger('GET for /users got called', LogLevel.DEBUG);

    const userController = new UserController(iocContainer.UserService);
    const users = await userController.selectAll();

    if (isTruthy(users)) res.status(200).json(users);
    else res.status(404).json({ message: 'No users found.' });
});

export default app;