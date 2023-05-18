import { UserController } from "../../api/controller/UserController";
import { UserDTO } from "../../api/dto/UserDTO";
import { generateUUID } from "../../util/uuid";
import { testServerConfig } from "../testServerConfig";
import App from "../../domain/App";
import { ContainerWrapper } from "../../ioc_container/ContainerWrapper";
import { TYPES } from "../../ioc_container/IocTypes";

describe('UserController', () => {
    let app: App;
    let userController: UserController;
    const johnUUID = generateUUID();
    const janeUUID = generateUUID();

    beforeAll(async () => {
        const containerWrapper = new ContainerWrapper(testServerConfig);
        containerWrapper.initContainer();

        app = containerWrapper.getContainer().get<App>(TYPES.App);
        userController = containerWrapper.getContainer().get<UserController>(TYPES.Controller);
        await app.start();
    });

    afterAll(async () => {
        await app.stop();
    });

    // ----------------------------

    test('upsert users', async () => {
        let userDto1 = new UserDTO();
        userDto1.uuid = johnUUID;
        userDto1.name = 'John Doe';

        let userDto2 = new UserDTO();
        userDto2.uuid = janeUUID;
        userDto2.name = 'Jane Doe';

        const userDtos = [userDto1, userDto2];

        const result = await userController.upsert(userDtos);
        expect(result).toEqual([
            {
                id: 2,
                uuid: janeUUID,
                name: 'Jane Doe'
            },
            {
                id: 1,
                uuid: johnUUID,
                name: 'John Doe'
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

    test.skip('get all users by uuids', async () => { // TODO: Fix!
        const uuids: string = `${johnUUID},${janeUUID}`;
        let uuidArray: string[] = uuids.split(',');
        const result = await userController.getByUuids(uuidArray);

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
