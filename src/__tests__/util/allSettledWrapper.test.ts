import { allSettledWrapper } from "../../util/allSettledWrapper";
import Logger from "../../util/logging/Logger";
import { testServerConfig } from "../testServerConfig";

describe('allSettledWrapper', () => {
    let logger: Logger;

    beforeEach(() => {
        logger = Logger.create(testServerConfig.logging);
    });

    // -------------------------------------------------- //

    test('allSettledWrapper should resolve to the input promise if it is fulfilled', async () => {
        try {
            const promise = Promise.resolve('hello');
            const result = await allSettledWrapper([promise]);

            // Do something with result if you want, but you now know none of them rejected.
        } catch (error) {
            fail(`allSettledWrapper should not have thrown an error: ${error}`);
        }
    });

    // -------------------------------------------------- //

    test('allSettledWrapper should throw an error with an array of rejection reasons if any input promise is rejected', async () => {
        const promises = [
            Promise.resolve('hello'),
            Promise.reject(new Error('oops')),
            Promise.resolve('world'),
        ];
        await expect(allSettledWrapper(promises)).rejects.toThrowError("Rejected promise's reasons: Error: oops");
    });

    // -------------------------------------------------- //

    test('allSettledWrapper should return an array of fulfilled promises if all input promises are fulfilled', async () => {
        const promises = [
            Promise.resolve('hello'),
            Promise.resolve('world'),
        ];
        const result = await allSettledWrapper(promises);
        const fulfillmentValues = await Promise.all(result);
        expect(fulfillmentValues).toEqual(['hello', 'world']);
    });

    // -------------------------------------------------- //

    test('allSettledWrapper should throw an error with an array of rejection reasons if multiple input promises are rejected', async () => {
        const promises = [
            Promise.resolve('hello'),
            Promise.reject(new Error('oops')),
            Promise.resolve('world'),
            Promise.reject(new Error('uh oh')),
            Promise.resolve('goodbye'),
        ];
        await expect(allSettledWrapper(promises)).rejects.toThrowError("Rejected promise's reasons: Error: oops, Error: uh oh");
    });

});
