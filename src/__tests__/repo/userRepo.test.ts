import { UserRepo } from "../../api/repo/UserRepo";
import { User } from "../../api/model/User";
import { generateUUID } from "../../util/uuid";
import { testServerConfig } from "../testServerConfig";
import App from "../../app/App";
import { ContainerWrapper } from "../../ioc/ContainerWrapper";
import { TYPES } from "../../ioc/TYPES";
import { UserDTO } from "../../api/dto/UserDTO";

describe('UserRepo', () => {
    let app: App;
    let userRepo: UserRepo;

    const johnUUID = generateUUID();
    const janeUUID = generateUUID();

    beforeAll(async () => {
        const containerWrapper = new ContainerWrapper(testServerConfig);
        containerWrapper.initContainer();

        app = containerWrapper.getContainer().get<App>(TYPES.App);
        userRepo = containerWrapper.getContainer().get<UserRepo>(TYPES.Repository);
        await app.start();
    });

    afterAll(async () => {
        await app.stop();
    });

    // ----------------------------

    test('should upsert a user', async () => {
        const john = new UserDTO();
        john._uuid = johnUUID;
        john._name = "John Doe";

        const jane = new UserDTO();
        jane._uuid = janeUUID;
        jane._name = "Jane Doe";

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
        const users = await userRepo.getAll();

        expect(users.length).toBe(2);
        expect(users[0]._name).toBe('John Doe');
        expect(users[1]._name).toBe('Jane Doe');
    });

    // ----------------------------

    test('should not insert user with same UUID', async () => {
        const john = new UserDTO();
        john._uuid = johnUUID;
        john._name = "John Doe";

        const users = await userRepo.getAll();
        expect(users.length).toBe(2);

        await expect(userRepo.upsert([john])).rejects.toThrowError('Error upserting users.');

        const newUsers = await userRepo.getAll();
        expect(newUsers.length).toBe(2);
    });
});
