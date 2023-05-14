import { Router } from "express";
import { IService } from "../service/IService";

export interface IController {
    readonly name: string;
    service: IService
    initRoutes: () => Router;
}