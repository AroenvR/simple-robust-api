import { PubSub } from "../../util/pubSub/PubSub";
import { TaskProcessor } from "../../util/taskProcessing/TaskProcessor";
import { IRepository } from "../repo/IRepository";

/**
 * TODO: Document.
 */
export interface IService {
    readonly name: string;
    repository: IRepository;
    taskProcessor: TaskProcessor;
    pubSub: PubSub;

    upsert(data: any | any[]): Promise<any>;
    getAll(): Promise<any>;
}