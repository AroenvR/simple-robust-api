import { PubSub } from "../../util/pubSub/PubSub";
import { TaskProcessor } from "../../util/taskProcessing/TaskProcessor";
import { IRepository } from "../repo/IRepository";
import { IService } from "./IService";

/**
 * The base class for all services.
 * @abstract
 * @implements {IService}
 */
export abstract class Service<T extends IRepository> implements IService {
    public abstract readonly name: string;
    protected repository: T;
    protected taskProcessor: TaskProcessor;
    protected pubSub: PubSub;

    constructor(repository: T, taskProcessor: TaskProcessor, pubSub: PubSub) {
        this.repository = repository;
        this.taskProcessor = taskProcessor;
        this.pubSub = pubSub;
    }

    public abstract upsert(params?: any[]): Promise<any[]>;

    public abstract getAll(): Promise<any[]>;
}