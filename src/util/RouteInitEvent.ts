import express from 'express';
import { EventEmitter } from 'events';
import { injectable } from 'inversify';

/**
 * RouteInitEvent class extends EventEmitter and is used to emit and listen for route
 * initialization events. Controllers can subscribe to this event and set up their routes
 * accordingly.
 */
@injectable()
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
