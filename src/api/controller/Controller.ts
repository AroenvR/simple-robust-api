import { injectable } from "inversify";
import { IService } from "../service/IService";
import { IController } from "./IController";
import { Router } from "express";

/**
 * The base class for all controllers.
 * @abstract
 * @template T - The type of service used by the controller.
 * @implements {IController}
 */
@injectable()
export abstract class Controller<T extends IService> implements IController {
    public abstract readonly name: string;
    protected service: T;
    protected router: Router;

    constructor(service: T) {
        this.service = service;
        this.router = Router();
    }

    public abstract initRoutes(): Router;
}