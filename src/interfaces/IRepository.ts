export interface IRepository {
    upsert(params?: any[]): Promise<void>;
    getAll(): Promise<any[]>;
}