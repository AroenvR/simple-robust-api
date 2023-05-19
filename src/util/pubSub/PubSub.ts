import { injectable } from "inversify";
import { ISubscriber } from "./ISubscriber";
import Logger from "../logging/Logger";

/**
 * The PubSub class provides a simple publish-subscribe pattern implementation.
 * It allows for publishing events and subscribing to them with callbacks.
 */
@injectable()
export class PubSub {
    private static _instance: PubSub;
    private subscribers: ISubscriber[] = [];

    /**
     * Gets the PubSub instance.
     * @throws Error if the instance is not created yet.
     */
    public static get instance(): PubSub {
        if (!this._instance) {
            throw new Error("PubSub instance not created. Call PubSub.create(config) first.");
        }
        return this._instance;
    }

    /**
     * Creates a PubSub instance with the given configuration.
     * @returns The created PubSub instance.
     */
    public static create(): PubSub {
        if (!this._instance) {
            this._instance = new PubSub();
        }
        return this._instance;
    }

    /**
     * Publishes an event to all subscribers of the specified event type.
     * @param eventType - The type of event being published.
     * @param event - The event data.
     */
    public async publish(eventType: string, event?: any): Promise<void> {
        if (!eventType) {
            Logger.instance.error(`Event type is falsy.`);
            return;
        }

        Logger.instance.debug(`PubSub: Publishing event of type ${eventType}`);

        this.subscribers.forEach((subscriber) => {
            if (subscriber.eventType === eventType) {
                subscriber.callback(event);
            }
        });
    }

    /**
     * Subscribes a callback to the specified event type.
     * @param subscriber - The subscriber object containing name, event type, and callback.
     */
    public async subscribe(subscriber: ISubscriber): Promise<void> {
        if (this.subscribers.some((s) => s.name === subscriber.name && s.eventType === subscriber.eventType)) {
            return;
        }

        this.subscribers.push(subscriber);
    }

    /**
     * Unsubscribes a callback from the specified event type.
     * @param {string} name - The name of the subscriber to unsubscribe.
     * @param {string} eventType - The event type to unsubscribe from.
     * @returns {Promise<void>}
     */
    public async unsubscribe(name: string, eventType: string): Promise<void> {
        if (!this.subscribers.some((s) => s.name === name && s.eventType === eventType)) {
            return;
        }

        this.subscribers = this.subscribers.filter((s) => !(s.name === name && s.eventType === eventType));
    }

    /**
     * Unsubscribes a subscriber from all event types.
     * @param {string} name - The name of the subscriber to unsubscribe.
     * @returns {Promise<void>}
     */
    public async unsubscribeAll(name: string): Promise<void> {
        this.subscribers = this.subscribers.filter((s) => s.name !== name);
    }

    /**
     * Returns all subscribers.
     * @returns {Subscriber[]} - The array of subscribers.
     */
    public async getSubscribers(): Promise<ISubscriber[]> {
        return this.subscribers;
    }
}