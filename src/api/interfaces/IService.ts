import { PubSub } from "../../util/PubSub";
import { TaskProcessor } from "../../util/TaskProcessor";
import { IRepository } from "../../interfaces/IRepository";

/**
 * TODO: Document.
 */
export interface IService {
    name: string;
    repository: IRepository;
    taskProcessor: TaskProcessor;
    pubSub: PubSub;

    upsert(data: any | any[]): Promise<any>;
    getAll(): Promise<any>;
}