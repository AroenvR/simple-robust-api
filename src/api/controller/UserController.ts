import express from 'express';
import { UserDTO } from "../dto/UserDTO";
import { UserService } from "../service/UserService";
import { IUserController } from "./IUserController";
import { RouteInitEvent } from '../../util/RouteInitEvent';
import Logger from '../../util/Logger';

export class UserController implements IUserController {
    readonly name = 'UserController';
    service: UserService;

    constructor(service: UserService, routeInitEvent: RouteInitEvent) {
        this.service = service;
        routeInitEvent.onRouteInit(this.setupRoutes.bind(this));
    }

    private setupRoutes(app: express.Application): void {
        app.get('/users', async (req, res) => {
            Logger.instance.debug('UserController: GET /users');

            try {
                const users = await this.selectAll();
                res.status(200).json(users);
            } catch (error) {
                res.status(500).json({ message: 'Error getting users', error });
            }
        });
    }

    /**
     * Upserts users.
     * @param {UserDTO[]} userDtos - The array of user data transfer objects.
     * @returns {Promise<any>} - The result of the upsert operation.
     */
    public async upsert(userDtos: UserDTO[]): Promise<any> {
        Logger.instance.debug(`${this.name}: Upserting users.`);

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
        Logger.instance.debug(`${this.name}: Getting all users.`);

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
}