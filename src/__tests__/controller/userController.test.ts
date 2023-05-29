import { UserController } from "../../api/controller/UserController";
import { UserDTO } from "../../api/dto/UserDTO";
import { generateUUID } from "../../util/uuid";
import { testServerConfig } from "../testServerConfig";
import App from "../../app/App";
import { ContainerWrapper } from "../../ioc/ContainerWrapper";
import { TYPES } from "../../ioc/TYPES";

describe('UserController', () => {
    let app: App;
    let userController: UserController;
    const johnUUID = generateUUID();
    const janeUUID = generateUUID();

    beforeAll(async () => {
        const containerWrapper = new ContainerWrapper(testServerConfig);
        containerWrapper.initContainer();

        app = containerWrapper.getContainer().get<App>(TYPES.App);
        await app.start();

        userController = containerWrapper.getContainer().get<UserController>(TYPES.Controller);
    });

    afterAll(async () => {
        await app.stop();
    });

    // ----------------------------

    test('upsert users', async () => {
        const userDto1 = new UserDTO();
        userDto1._uuid = johnUUID;
        userDto1._name = 'John Doe';

        const userDto2 = new UserDTO();
        userDto2._uuid = janeUUID;
        userDto2._name = 'Jane Doe';

        const userDtos = [userDto1, userDto2];

        const result = await userController.upsert(userDtos);
        expect(result).toEqual([
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

    test('get all users without params', async () => {
        const result = await userController.handleGet();
        expect(result.length).toBe(2);
        expect(result).toEqual([
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

    test('get all users by uuids', async () => {
        const uuids: string[] = [johnUUID, janeUUID];
        const result = await userController.getByUuids(uuids);

        expect(result.length).toBe(2);
        expect(result).toEqual([
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
});
