import { Router } from "express";
import { IService } from "../service/IService";

export interface IController {
    readonly name: string;

    /**
     * Initializes the routes for the controller. 
     * @returns A Router object containing the routes for the controller.
     */
    initRoutes: () => Router;
}