import express from 'express';
import { EventEmitter } from 'events';

export class RouteInitEvent extends EventEmitter {
    public static readonly eventName = 'routeInit';

    constructor() {
        super();
    }

    emitRouteInit(app: express.Application): void {
        this.emit(RouteInitEvent.eventName, app);
    }

    onRouteInit(listener: (app: express.Application) => void): void {
        this.on(RouteInitEvent.eventName, listener);
    }
}
