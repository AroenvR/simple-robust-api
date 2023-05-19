import { PubSub } from "../../util/PubSub";
import { TaskProcessor } from "../../util/TaskProcessor";
import { UserDTO } from "../dto/UserDTO";
import { User } from "../model/User";
import Logger from "../../util/Logger";
import { inject, injectable } from "inversify";
import { TYPES } from "../../ioc_container/IocTypes";
import { IUserService } from "./IUserService";
import { IUserRepo } from "../repo/IUserRepo";

/**
 * The UserService class provides methods for managing users in the application.
 */
@injectable()
export class UserService implements IUserService {
    readonly name = 'UserService';
    repository: IUserRepo;
    taskProcessor: TaskProcessor;
    pubSub: PubSub;

    /**
     * Creates a new UserService instance.
     * @param {UserRepo} repository - The user repository instance.
     * @param {TaskProcessor} taskProcessor - The task processor instance.
     * @param {PubSub} pubSub - The pub/sub instance.
     */
    constructor(@inject(TYPES.Repository) repository: IUserRepo, @inject(TYPES.TaskProcessor) taskProcessor: TaskProcessor, @inject(TYPES.PubSub) pubSub: PubSub) {
        this.repository = repository;
        this.taskProcessor = taskProcessor;
        this.pubSub = pubSub;
    }

    /**
     * Creates one or more new users and stores them in the database.
     * @param {UserDTO[]} userDtos - An array of user data transfer objects.
     * @returns {Promise<any>} - A promise that resolves to the result of the user creation operation.
     */
    async upsert(userDtos: UserDTO[]): Promise<UserDTO[]> {
        let users: User[] = [];

        users = userDtos.map((userDto: UserDTO) => new User(0, userDto.uuid, userDto.name));

        try {
            const result = await this.repository.upsert(users);

            this.pubSub.publish('user-created', result);

            return result;
        } catch (error: Error | any) {
            Logger.instance.error(`${this.name}: Error creating a users:`, error);
            throw error;
        }
    }

    /**
     * Gets all users.
     * @returns {Promise<UserDTO[]>} - A promise that resolves to an array of users.
     */
    async getAll(): Promise<UserDTO[]> {
        Logger.instance.info(`${this.name}: Getting all users.`);

        return this.repository.getAll();
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

        return this.repository.selectByUuids(uuids);;
    }
}