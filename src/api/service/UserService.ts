import { IService } from "./IService";
import { PubSub } from "../../util/PubSub";
import { TaskProcessor } from "../../util/TaskProcessor";
import { UserDTO } from "../dto/UserDTO";
import { User } from "../model/User";
import { UserRepo } from "../repo/UserRepo";
import Logger from "../../util/Logger";

/**
 * The UserService class provides methods for managing users in the application.
 */
export class UserService implements IService {
    readonly name = 'UserService';
    repository: UserRepo;
    taskProcessor: TaskProcessor;
    pubSub: PubSub;

    /**
     * Creates a new UserService instance.
     * @param {UserRepo} repository - The user repository instance.
     * @param {TaskProcessor} taskProcessor - The task processor instance.
     * @param {PubSub} pubSub - The pub/sub instance.
     */
    constructor(repository: UserRepo, taskProcessor: TaskProcessor, pubSub: PubSub) {
        this.repository = repository;
        this.taskProcessor = taskProcessor;
        this.pubSub = pubSub;
    }

    /**
     * Creates one or more new users and stores them in the database.
     * @param {UserDTO[]} userDtos - An array of user data transfer objects.
     * @returns {Promise<any>} - A promise that resolves to the result of the user creation operation.
     */
    async upsert(userDtos: UserDTO | UserDTO[]): Promise<number> {
        let users: User[] = [];

        if (Array.isArray(userDtos)) users = userDtos.map((userDto: UserDTO) => new User(0, userDto.uuid, userDto.name));
        else users = [new User(0, userDtos.uuid, userDtos.name)];

        try {
            const result = await this.repository.upsert(users);

            this.pubSub.publish('user-created', result);

            return result;
        } catch (error: Error | any) {
            Logger.instance.error(`${this.name}: Error creating a user:`, error);
            throw error;
        }
    }

    /**
     * Gets all users.
     * @returns {Promise<User[]>} - A promise that resolves to an array of users.
     */
    async getAll(): Promise<User[]> {
        Logger.instance.debug(`${this.name}: Getting all users.`);

        return this.repository.selectAll();
    }
}