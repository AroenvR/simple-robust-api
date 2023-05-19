import { IStorage } from "./IStorage";

/**
 * A utility class that provides a simple in-memory key-value storage that persists for the duration of the session.
 */
export class SessionStorage {
    private static _instance: SessionStorage;
    private _storage: IStorage;

    /**
     * Creates a new instance of the `SessionStorage` class.
     */
    constructor() {
        this._storage = {};
    }

    /**
     * Gets the SessionStorage instance.
     * @throws Error if the instance is not created yet.
     */
    public static get instance(): SessionStorage {
        if (!this._instance) {
            throw new Error("PubSub instance not created. Call PubSub.create(config) first.");
        }
        return this._instance;
    }

    /**
     * Creates a SessionStorage instance.
     * @returns The created SessionStorage instance.
     */
    public static create(): SessionStorage {
        if (!this._instance) {
            this._instance = new SessionStorage();
        }
        return this._instance;
    }

    /**
     * Gets the value associated with the specified key.
     * @param key - The key to retrieve the value for.
     * @returns A promise that resolves to the value associated with the specified key, or null if the key does not exist.
     */
    async getItem(key: string): Promise<string | null> {
        return this._storage[key] || null;
    }

    /**
     * Sets the value associated with the specified key.
     * @param key - The key to set the value for.
     * @param value - The value to set.
     * @returns A promise that resolves when the value has been set.
     */
    async setItem(key: string, value: string): Promise<void> {
        this._storage[key] = value;
    }

    /**
     * Removes the value associated with the specified key.
     * @param key - The key to remove the value for.
     * @returns A promise that resolves when the value has been removed.
     */
    async removeItem(key: string): Promise<void> {
        delete this._storage[key];
    }

    /**
     * Removes all values from the storage.
     * @returns A promise that resolves when all values have been removed.
     */
    async clear(): Promise<void> {
        this._storage = {};
    }
}