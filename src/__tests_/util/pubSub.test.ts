import { ISubscriber } from '../../interfaces/ISubscriber';
import { PubSub } from '../../util/PubSub';

describe('PubSub', () => {
    let pubSub: PubSub;

    beforeAll(async () => {
        jest.spyOn(console, 'debug').mockImplementation(() => { });
    });

    afterAll(async () => {
        jest.restoreAllMocks();
    });

    beforeEach(() => {
        pubSub = new PubSub();
    });

    // ------------------------------------

    test('subscribe and publish', async () => {
        const eventType = 'testEvent';
        const eventData = { message: 'Hello, world!' };

        const subscriber: ISubscriber = {
            name: 'testSubscriber',
            eventType: eventType,
            callback: jest.fn(),
        };

        await pubSub.subscribe(subscriber);
        await pubSub.publish(eventType, eventData);

        expect(subscriber.callback).toHaveBeenCalledWith(eventData);
    });

    test('unsubscribe', async () => {
        const eventType = 'testEvent';

        const subscriber: ISubscriber = {
            name: 'testSubscriber',
            eventType: eventType,
            callback: jest.fn(),
        };

        await pubSub.subscribe(subscriber);
        await pubSub.unsubscribe(subscriber.name, eventType);
        await pubSub.publish(eventType, {});

        expect(subscriber.callback).not.toHaveBeenCalled();
    });

    test('unsubscribeAll', async () => {
        const eventType1 = 'testEvent1';
        const eventType2 = 'testEvent2';

        const subscriber: ISubscriber = {
            name: 'testSubscriber',
            eventType: eventType1,
            callback: jest.fn(),
        };

        const subscriber2: ISubscriber = {
            name: 'testSubscriber',
            eventType: eventType2,
            callback: jest.fn(),
        };

        await pubSub.subscribe(subscriber);
        await pubSub.subscribe(subscriber2);
        await pubSub.unsubscribeAll(subscriber.name);
        await pubSub.publish(eventType1, {});
        await pubSub.publish(eventType2, {});

        expect(subscriber.callback).not.toHaveBeenCalled();
        expect(subscriber2.callback).not.toHaveBeenCalled();
    });

    test('getSubscribers', async () => {
        const eventType = 'testEvent';

        const subscriber: ISubscriber = {
            name: 'testSubscriber',
            eventType: eventType,
            callback: jest.fn(),
        };

        await pubSub.subscribe(subscriber);

        const subscribers = await pubSub.getSubscribers();
        expect(subscribers).toContainEqual(subscriber);
    });
});
