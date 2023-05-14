import express from 'express';
import { EventEmitter } from 'events';
import { injectable } from 'inversify';
import Logger from './Logger';

/**
 * RouteInitEvent class using EventEmitter to emit and listen for route initialization events.  
 * Controllers can subscribe to this event and set up their routes accordingly.
 */
@injectable()
export class RouteInitEvent {
    private eventEmitter: EventEmitter;
    public static readonly eventName = 'routeInit';

    constructor() {
        this.eventEmitter = new EventEmitter();
    }

    emitRouteInit(app: express.Application): void {
        Logger.instance.debug('RouteInitEvent: Emitting route init event.');
        this.eventEmitter.emit(RouteInitEvent.eventName, app);
    }

    onRouteInit(listener: (app: express.Application) => void): void {
        Logger.instance.debug('RouteInitEvent: Got a new Subscriber!');
        this.eventEmitter.on(RouteInitEvent.eventName, listener);
    }
}
