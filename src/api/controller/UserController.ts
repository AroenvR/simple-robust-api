import { Router } from 'express';
import { UserDTO } from "../dto/UserDTO";
import { IUserController } from "./IUserController";
import Logger from '../../util/logging/Logger';
import validator from 'validator';
import ValidationError from '../../util/errors/ValidationError';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../ioc/TYPES';
import { IUserService } from '../service/IUserService';
import { isTruthy } from '../../util/isTruthy';
import NotFoundError from '../../util/errors/NotFoundError';

@injectable()
export class UserController implements IUserController {
    readonly name = 'UserController';
    service: IUserService;
    router: Router;

    constructor(@inject(TYPES.Service) service: IUserService) {
        this.service = service;
        this.router = Router();
    }

    public initRoutes(): Router {
        /**
         * GET /users
         */
        this.router.get('/users', async (req, res, next) => {
            try {
                let users = await this.handleGet(req.query);

                const toReturn = users.sort(user => user.id);
                res.status(200).json(toReturn);
            } catch (error) {
                next(error);
            }
        });

        /**
         * POST /users
         */
        this.router.post('/users', async (req, res, next) => {
            try {
                const result = await this.upsert(req.body);

                const toReturn = result.sort(user => user.id);
                res.status(201).json(toReturn);
            } catch (error) {
                next(error);
            }
        });

        return this.router;
    }

    /**
     * Retrieves all users.
     * @returns The array of users.
     */
    public async handleGet(query?: any): Promise<UserDTO[]> {
        if (!isTruthy(query)) {
            Logger.instance.info(`${this.name}: Getting all users.`);
            return this.service.getAll();
        }

        const ids = query!.ids as string;
        const uuids = query!.uuids as string;

        if (isTruthy(ids)) {
            let idArray: number[] = ids.split(',').map((id) => parseInt(id));

            return this.service.getByIds(idArray);
        }

        if (isTruthy(uuids)) {
            let uuidArray: string[] = uuids.split(',');
            return this.getByUuids(uuidArray);
        }

        throw new NotFoundError('Invalid query parameters.');
    }

    /**
     * Upserts users.
     * @param userDtos The array of user data transfer objects.
     * @returns The result of the upsert operation.
     */
    public async upsert(userDtos: UserDTO[]): Promise<UserDTO[]> {
        Logger.instance.info(`${this.name}: Upserting users.`);

        await this.checkUsers(userDtos);

        return await this.service.upsert(userDtos);
    }

    public async getByUuids(uuids: string[]): Promise<UserDTO[]> { // TODO: test
        Logger.instance.info(`${this.name}: Getting users by uuids.`);

        for (const item of uuids) {
            if (!validator.isUUID(item)) {
                Logger.instance.error(`UserController: GET /users invalid uuid: ${item}`);
                throw new ValidationError(`Invalid uuid: ${item}`);
            }
        }

        return this.service.getByUuids(uuids);
    }


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