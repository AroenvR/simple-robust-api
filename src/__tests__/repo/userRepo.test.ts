import { UserRepo } from "../../api/repo/users/UserRepo";
import { User } from "../../api/model/users/User";
import { generateUUID } from "../../util/uuid";
import { testServerConfig } from "../testServerConfig";
import App from "../../app/App";
import { ContainerWrapper } from "../../ioc/ContainerWrapper";
import { TYPES } from "../../ioc/TYPES";

describe('UserRepo', () => {
    let app: App;
    let userRepo: UserRepo;

    const johnUUID = generateUUID();
    const janeUUID = generateUUID();

    beforeAll(async () => {
        const containerWrapper = new ContainerWrapper(testServerConfig);
        containerWrapper.initContainer();

        app = containerWrapper.getContainer().get<App>(TYPES.App);
        await app.start();

        userRepo = containerWrapper.getContainer().get<UserRepo>(TYPES.Repository);
    });

    afterAll(async () => {
        await app.stop();
    });

    // ----------------------------

    test('should upsert a user', async () => {
        const john = new User(null, johnUUID, "John Doe");
        const jane = new User(null, janeUUID, "Jane Doe");

        const resp = await userRepo.upsert([john, jane]);

        expect(resp).toEqual([
            {
                id: 1,
                uuid: johnUUID,
                name: 'John Doe'
            },
            {
                id: 2,
                uuid: janeUUID,
                name: 'Jane Doe'
            },
        ]);
    });

    // ----------------------------

    test('should get all users', async () => {
        const users = await userRepo.selectAll();

        expect(users.length).toBe(2);
        expect(users).toEqual([
            {
                id: 1,
                uuid: johnUUID,
                name: 'John Doe'
            },
            {
                id: 2,
                uuid: janeUUID,
                name: 'Jane Doe'
            },
        ]);
    });

    // ----------------------------

    test('should not insert user with same UUID', async () => {
        const john = new User(null, johnUUID, "John Doe");

        const users = await userRepo.selectAll();
        expect(users.length).toBe(2);

        await userRepo.upsert([john]);

        const newUsers = await userRepo.selectAll();
        expect(newUsers.length).toBe(2);
    });
});
