import express from 'express';
import { UserDTO } from "../dto/UserDTO";
import { UserService } from "../service/UserService";
import { IUserController } from "./IUserController";
import { RouteInitEvent } from '../../util/RouteInitEvent';
import Logger from '../../util/Logger';
import validator from 'validator';
import { sanitizeObject, sanitizeValue } from '../../middleware/sanitize'; // Working on sanitization..
import sanitizeHtml from 'sanitize-html';
import xss from 'xss';

export class UserController implements IUserController {
    readonly name = 'UserController';
    service: UserService;

    constructor(service: UserService, routeInitEvent: RouteInitEvent) {
        this.service = service;
        routeInitEvent.onRouteInit(this.setupRoutes.bind(this));
    }

    private setupRoutes(app: express.Application): void {
        app.get('/users', async (req, res) => {
            Logger.instance.log('UserController: GET /users.');

            try {
                const users = await this.selectAll();
                res.status(200).json(users);
                Logger.instance.info('UserController: GET /users success.');
                Logger.instance.debug('UserController: GET /users returning:', users);
            } catch (error) {
                res.status(500).json({ message: 'Error getting users', error });
            }
        });

        app.post('/users', async (req, res) => {
            Logger.instance.log('UserController: POST /users.');
            Logger.instance.debug('UserController: POST /users received data:', req.body);

            let userDtos = req.body;
            if (!Array.isArray(userDtos)) userDtos = [userDtos];

            if (!userDtos.every(this.isValid)) {
                res.status(400).json({ message: 'Invalid request body' });
                Logger.instance.error('UserController: POST /users Invalid request body.');
                return;
            }

            try {
                const result = await this.upsert(userDtos);

                res.status(200).json(result);
                Logger.instance.info('UserController: POST /users success.');
                Logger.instance.debug('UserController: POST /users returning:', result);
            } catch (error) {
                res.status(500).json({ message: 'Error upserting users', error });
                Logger.instance.error('UserController: POST /users error:', error);
            }
        });
    }

    /**
     * Upserts users.
     * @param {UserDTO[]} userDtos - The array of user data transfer objects.
     * @returns {Promise<any>} - The result of the upsert operation.
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
     * @returns {Promise<any[]>} - The array of users.
     */
    public async selectAll(): Promise<any[]> {
        Logger.instance.info(`${this.name}: Getting all users.`);

        try {
            const users = await this.service.getAll();
            return users;
        } catch (error) {
            console.error('UserController: Error getting all users', error);
            throw error;
        }
    }

    public async getLast(): Promise<any> {
        throw new Error('Method not implemented.');
    }

    private isValid(user: UserDTO): boolean {
        Logger.instance.debug("isValid checking userDTO:", user);

        // Validate uuid
        if (typeof user.uuid !== 'string' || !validator.isUUID(user.uuid)) {
            Logger.instance.debug("isValid failed on uuid:", user.uuid);
            return false;
        }

        // Validate name
        if (typeof user.name !== 'string' || !validator.isLength(user.name, { min: 3 })) {
            Logger.instance.debug("isValid failed on name:", user.name);
            return false;
        }

        return true;
    };
}