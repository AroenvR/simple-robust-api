import { SessionStorage } from "../../util/sessionStorage/SessionStorage";

describe('SessionStorage', () => {
    let sessionStorage: SessionStorage;

    beforeEach(() => {
        sessionStorage = SessionStorage.create();
    });

    afterEach(() => {
        sessionStorage.clear();
    });

    it('should set and get an item', async () => {
        const key = 'testKey';
        const value = 'testValue';

        await sessionStorage.setItem(key, value);
        const result = await sessionStorage.getItem(key);

        expect(result).toEqual(value);
    });

    it('should remove an item', async () => {
        const key = 'testKey';
        const value = 'testValue';

        await sessionStorage.setItem(key, value);
        await sessionStorage.removeItem(key);
        const result = await sessionStorage.getItem(key);

        expect(result).toBeNull();
    });

    it('should clear all items', async () => {
        const key1 = 'testKey1';
        const value1 = 'testValue1';
        const key2 = 'testKey2';
        const value2 = 'testValue2';

        await sessionStorage.setItem(key1, value1);
        await sessionStorage.setItem(key2, value2);
        await sessionStorage.clear();
        const result1 = await sessionStorage.getItem(key1);
        const result2 = await sessionStorage.getItem(key2);

        expect(result1).toBeNull();
        expect(result2).toBeNull();
    });

    it('should handle at least 100 objects', async () => {
        const numObjects = 100;

        for (let i = 0; i < numObjects; i++) {
            const key = `key${i}`;
            const value = `value${i}`;

            await sessionStorage.setItem(key, value);
        }

        for (let i = 0; i < numObjects; i++) {
            const key = `key${i}`;
            const value = `value${i}`;

            const result = await sessionStorage.getItem(key);

            expect(result).toEqual(value);
        }
    });
});