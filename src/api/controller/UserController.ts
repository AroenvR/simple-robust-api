import { Router } from 'express';
import { UserDTO } from "../dto/UserDTO";
import { UserService } from "../service/UserService";
import { IUserController } from "./IUserController";
import Logger from '../../util/Logger';
import validator from 'validator';
import ValidationError from '../../errors/ValidationError';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../ioc_container/IocTypes';
import { IUserService } from '../service/IUserService';

@injectable()
export class UserController implements IUserController {
    readonly name = 'UserController';
    service: IUserService;

    constructor(@inject(TYPES.Service) service: IUserService) {
        this.service = service;
    }

    /**
     * Upserts users.
     * @param userDtos - The array of user data transfer objects.
     * @returns The result of the upsert operation.
     */
    public async upsert(userDtos: UserDTO[]): Promise<any> {
        Logger.instance.info(`${this.name}: Upserting users.`);

        try {
            const result = await this.service.upsert(userDtos);
            return result;
        } catch (error) {
            Logger.instance.error(`${this.name}: Error upserting users`, error);
            throw error;
        }
    }

    /**
     * Retrieves all users.
     * @returns The array of users.
     */
    public async getAll(): Promise<any[]> {
        Logger.instance.info(`${this.name}: Getting all users.`);

        try {
            const users = await this.service.getAll();
            return users;
        } catch (error) {
            console.error('UserController: Error getting all users', error);
            throw error;
        }
    }

    public async getByUuids(uuids: string[]): Promise<UserDTO[]> {
        Logger.instance.info(`${this.name}: Getting users by uuids.`);
        Logger.instance.debug(`${this.name}: Getting users by uuids:`, uuids);

        return await this.service.getByUuids(uuids);
    }

    public async getLast(): Promise<any> {
        throw new Error('Method not implemented.');
    }

    public initRoutes(): Router {
        const router = Router();

        router.get('/users', async (req, res, next) => {
            try {
                const users = await this.getAll();
                res.status(200).json(users);
            } catch (error) {
                next(error);
            }
        });

        router.post('/users', async (req, res, next) => {
            Logger.instance.log('UserController: POST /users.');
            Logger.instance.debug('UserController: POST /users received data:', req.body);

            let userDtos = req.body;
            if (!Array.isArray(userDtos)) userDtos = [userDtos];

            try {
                await this.checkUsers(userDtos);
                const result = await this.upsert(userDtos);

                Logger.instance.info('UserController: POST /users success.');
                Logger.instance.debug('UserController: POST /users returned:', result);
                res.status(201).json(result);
            } catch (error) {
                Logger.instance.error('UserController: POST /users error:', error);
                next(error);
            }
        });

        return router;
    }

    // private setupRoutes(app: express.Application): void {
    //     app.get('/users', async (req, res, next) => {
    //         try {
    //             const users = await this.getAll();
    //             res.status(200).json(users);
    //         } catch (error) {
    //             next(error);
    //         }
    //     });

    //     app.get('/users/uuid', async (req, res, next) => {
    //         Logger.instance.log('UserController: GET /users/uuid.');

    //         if (!isTruthy(req.query.uuid) && !isTruthy(req.query.uuids)) {
    //             Logger.instance.error('UserController: GET /users/uuid missing required query parameter: uuid or uuids');
    //             res.status(400).json({ message: 'Missing required query parameter: uuid or uuids' });
    //             return;
    //         }

    //         Logger.instance.debug('UserController: GET /users/uuid received query parameters:', req.query);

    //         let uuids: any = [req.query.uuid];
    //         if (!isTruthy(uuids)) uuids = req.query.uuids;

    //         try {
    //             for (const uuid of uuids) {
    //                 if (!validator.isUUID(uuid)) {
    //                     Logger.instance.error('UserController: GET /users/uuid invalid uuid:', uuid);
    //                     throw new ValidationError(`Invalid uuid: ${uuid}`);
    //                 }
    //             }

    //             const users = await this.getByUuids(uuids);
    //             res.status(200).json(users);

    //             Logger.instance.info('UserController: GET /users/uuid success.');
    //             Logger.instance.debug('UserController: GET /users/uuid returned:', users);
    //         } catch (error) {
    //             Logger.instance.error('UserController: GET /users/uuid error:', error);
    //             next(error);
    //         }
    //     });

    //     app.post('/users', async (req, res, next) => {
    //         Logger.instance.log('UserController: POST /users.');
    //         Logger.instance.debug('UserController: POST /users received data:', req.body);

    //         let userDtos = req.body;
    //         if (!Array.isArray(userDtos)) userDtos = [userDtos];

    //         try {
    //             await this.checkUsers(userDtos);
    //             const result = await this.upsert(userDtos);

    //             Logger.instance.info('UserController: POST /users success.');
    //             Logger.instance.debug('UserController: POST /users returned:', result);
    //             res.status(201).json(result);
    //         } catch (error) {
    //             Logger.instance.error('UserController: POST /users error:', error);
    //             next(error);
    //         }
    //     });
    // }

    /**
     * Asynchronously checks the validity of an array of users.
     * @param users - An array of user objects to be validated.
     * @returns A promise that resolves to `true` if all users are valid.
     * @throws If any user fails validation, a ValidationError is thrown with a specific error message.
     */
    private async checkUsers(users: UserDTO[]): Promise<boolean> {
        const promises: Promise<boolean>[] = [];

        for (const user of users) {
            promises.push(this.isValid(user));
        }

        await Promise.allSettled(promises)
            .then((results) => {
                results.forEach((result) => {
                    if (result.status === 'rejected') {
                        throw result.reason;
                    }
                });
            });

        return true;
    }

    /**
     * Asynchronously validates a single user object.
     * @param user - The user object to be validated.
     * @returns A promise that resolves to `true` if the user is valid.
     * @throws If the user fails validation, a ValidationError is thrown with a specific error message.
     */
    private async isValid(user: UserDTO): Promise<boolean> {
        Logger.instance.debug("isValid checking userDTO:", user);

        // Validate uuid
        if (typeof user.uuid !== 'string' || !validator.isUUID(user.uuid)) {
            Logger.instance.error("isValid failed on uuid:", user.uuid);
            throw new ValidationError('Invalid uuid');
        }

        // Validate name
        if (typeof user.name !== 'string' || !validator.isLength(user.name, { min: 3 })) {
            Logger.instance.error("isValid failed on name:", user.name);
            throw new ValidationError('Invalid name');
        }

        return true;
    };
}