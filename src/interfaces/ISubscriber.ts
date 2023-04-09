type Callback = (event: any) => void;

/**
 * The Subscriber interface defines the structure of a subscriber.
 */
export interface ISubscriber {
    name: string;
    eventType: string;
    callback: Callback;
}