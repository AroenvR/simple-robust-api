type Callback = (event: any) => void;

/**
 * The Subscriber interface defines the structure of a subscriber.
 * @interface
 * @property {string} name - The name of the subscriber.
 * @property {string} eventType - The type of event that the subscriber is listening for.
 * @property {Callback} callback - The callback function that is executed when an event of the specified type is published.
 */
export interface ISubscriber {
    name: string;
    eventType: string;
    callback: Callback;
}