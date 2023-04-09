import { IService } from "../interfaces/IService";
import { UserDTO } from "../dto/UserDTO";
import { UserService } from "../service/UserService";
import { IController } from "../interfaces/IController";

export class UserController implements IController {
    service: UserService;

    constructor(service: UserService) {
        this.service = service;
    }

    /**
     * Upserts users.
     * @param {UserDTO[]} userDtos - The array of user data transfer objects.
     * @returns {Promise<any>} - The result of the upsert operation.
     */
    public async upsert(userDtos: UserDTO[]): Promise<any> {
        try {
            const result = await this.service.create(userDtos);
            return result;
        } catch (error) {
            console.error('UserController: Error upserting users', error);
            throw error;
        }
    }

    /**
     * Retrieves all users.
     * @returns {Promise<any[]>} - The array of users.
     */
    public async getAll(): Promise<any[]> {
        try {
            const users = await this.service.getAll();
            return users;
        } catch (error) {
            console.error('UserController: Error getting all users', error);
            throw error;
        }
    }
}