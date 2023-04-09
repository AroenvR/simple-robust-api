import { ISubscriber } from "../interfaces/ISubscriber";
import { LogLevel, logger } from "./logger";

/**
 * The PubSub class provides a simple publish-subscribe pattern implementation.
 * It allows for publishing events and subscribing to them with callbacks.
 */
export class PubSub {
    private subscribers: ISubscriber[] = [];

    /**
     * Publishes an event to all subscribers of the specified event type.
     * @param {string} eventType - The type of event being published.
     * @param {any} event - The event data.
     * @returns {Promise<void>}
     */
    public async publish(eventType: string, event: any): Promise<void> {
        if (!eventType) {
            logger(`Event type is falsy.`, LogLevel.ERROR);
            return;
        }

        logger(`PubSub: Publishing event of type ${eventType}`, LogLevel.DEBUG);

        this.subscribers.forEach((subscriber) => {
            if (subscriber.eventType === eventType) {
                subscriber.callback(event);
            }
        });
    }

    /**
     * Subscribes a callback to the specified event type.
     * @param {Subscriber} subscriber - The subscriber object containing name, event type, and callback.
     * @returns {Promise<void>}
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