import { PubSub } from "../../util/pubSub/PubSub";
import { TaskProcessor } from "../../util/taskProcessing/TaskProcessor";
import { UserDTO } from "../dto/UserDTO";
import Logger from "../../util/logging/Logger";
import { inject, injectable } from "inversify";
import { TYPES } from "../../ioc/TYPES";
import { IUserService } from "./IUserService";
import { IUserRepo } from "../repo/IUserRepo";
import { Service } from "./Service";
import { User } from "../model/User";

// TODO: Caching?

/**
 * The UserService class provides methods for managing users in the application.
 */
@injectable()
export class UserService extends Service<IUserRepo> implements IUserService {
    readonly name = 'UserService';

    /**
     * Creates a new UserService instance.
     * @param {UserRepo} repository - A user repository.
     * @param {TaskProcessor} taskProcessor - The task processor instance.
     * @param {PubSub} pubSub - The pub/sub instance.
     */
    constructor(@inject(TYPES.Repository) repository: IUserRepo, @inject(TYPES.TaskProcessor) taskProcessor: TaskProcessor, @inject(TYPES.PubSub) pubSub: PubSub) {
        super(repository, taskProcessor, pubSub);
    }

    /**
     * Creates one or more new users and stores them in the database.
     * @param {UserDTO[]} userDtos - An array of user data transfer objects.
     * @returns {Promise<any>} - A promise that resolves to the result of the user creation operation.
     */
    async upsert(userDtos: UserDTO[]): Promise<UserDTO[]> {
        Logger.instance.info(`${this.name}: Creating users.`);
        Logger.instance.debug(`${this.name}: userDTO's:`, userDtos);

        try {
            const users = userDtos.map((dto: UserDTO) => new User(dto._id, dto._uuid, dto._name));
            const result = await this.repository.upsert(users);

            const resultDtos = result.map((user: User) => {
                const dto = new UserDTO();
                dto.fromData(user);
                dto.isValid();
                return dto;
            });

            this.pubSub.publish('users-created', resultDtos);

            Logger.instance.debug(`${this.name} upserted. Returning result:`, result);
            return resultDtos;

        } catch (error: Error | any) {
            Logger.instance.error(`${this.name}: Error creating users:`, error);
            throw error;
        }
    }

    /**
     * Gets all users.
     * @returns {Promise<UserDTO[]>} - A promise that resolves to an array of users.
     */
    async getAll(): Promise<UserDTO[]> {
        Logger.instance.info(`${this.name}: Getting all users.`);

        try {
            const result = await this.repository.selectAll();

            const resultDtos = result.map((user: User) => {
                const dto = new UserDTO();
                dto.fromData(user);
                dto.isValid();
                return dto;
            });

            Logger.instance.debug(`${this.name}: got all users. Returning result:`, resultDtos);
            return resultDtos;

        } catch (err) {
            Logger.instance.error(`${this.name}: Error getting all users:`, err);
            throw err;
        }
    }

    /**
     * Gets users by id's.
     * @param ids - An array of user id's.
     */
    async getByIds(ids: number[]): Promise<UserDTO[]> {
        Logger.instance.info(`${this.name}: Getting users by id's.`);
        throw new Error("Method not implemented.");
    }

    /**
     * Gets users by UUID's.
     * @param uuids - An array of user UUID's.
     * @returns A promise that resolves to an array of userDto's.
     * @throws {NotFoundError} - If no users are found.
     */
    async getByUuids(uuids: string[]): Promise<UserDTO[]> {
        Logger.instance.info(`${this.name}: Getting users by UUID's.`);

        try {
            const result = await this.repository.selectByUuids(uuids);

            const resultDtos = result.map((user: User) => {
                const dto = new UserDTO();
                dto.fromData(user);
                dto.isValid();
                return dto;
            });

            Logger.instance.debug(`${this.name}: got users by UUID's. Returning result:`, resultDtos);
            return resultDtos;

        } catch (err) {
            Logger.instance.error(`${this.name}: Error getting users by UUID's:`, err);
            throw err;
        }
    }

    /**
     * Gets users by names.
     * @param names - An array of user names.
     * @returns A promise that resolves to an array of UserDTO objects.
     * @throws {NotFoundError} If no users are found.
     */
    async getByNames(names: string[]): Promise<UserDTO[]> {
        Logger.instance.info(`${this.name}: Getting users by names.`);

        try {
            const result = await this.repository.selectByNames(names);

            const resultDtos = result.map((user: User) => {
                const dto = new UserDTO();
                dto.fromData(user);
                dto.isValid();
                return dto;
            });

            Logger.instance.debug(`${this.name}: got users by names. Returning result:`, resultDtos);
            return resultDtos;

        } catch (err) {
            Logger.instance.error(`${this.name}: Error getting users by names:`, err);
            throw err;
        }
    }
}