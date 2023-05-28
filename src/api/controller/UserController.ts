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
                const users = await this.handleGet(req.query);

                const toReturn = users.sort(user => user._id);
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

                const toReturn = result.sort(user => user._id);
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
    public async handleGet(query?: any): Promise<UserDTO[]> { // TODO: Enable multiple query parameters + filtering by name.
        Logger.instance.debug(`${this.name}: Getting users. Query:`, query);

        if (!isTruthy(query)) {
            Logger.instance.info(`${this.name}: Getting all users.`);
            return this.service.select();
        }

        const ids = query!.ids as string;
        const uuids = query!.uuids as string;

        if (isTruthy(ids)) {
            const idArray: number[] = ids.split(',').map((id) => parseInt(id));

            return this.service.getByIds(idArray);
        }

        if (isTruthy(uuids)) {
            const uuidArray: string[] = uuids.split(',');
            return this.getByUuids(uuidArray);
        }

        throw new NotFoundError('Invalid query parameters.');
    }

    /**
     * Upserts users.
     * @param userDtos The array of user data transfer objects.
     * @returns The result of the upsert operation.
     */
    public async upsert(data: any[]): Promise<UserDTO[]> {
        Logger.instance.info(`${this.name}: Upserting users.`);
        Logger.instance.debug(`${this.name}: Upserting data:`, data);

        const userDtos = data.map((item: any) => {
            const dto = new UserDTO();
            dto.fromData(item);
            dto.isValid();
            return dto;
        });

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
}