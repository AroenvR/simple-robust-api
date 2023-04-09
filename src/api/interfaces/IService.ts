import { PubSub } from "../../util/PubSub";
import { TaskProcessor } from "../../util/TaskProcessor";
import { IRepository } from "../../interfaces/IRepository";

/**
 * TODO: Document.
 */
export interface IService {
    repository: IRepository;
    taskProcessor: TaskProcessor;
    pubSub: PubSub;
}