export interface IRepository {
    upsert(params?: any[]): Promise<any>;
    getAll(): Promise<any[]>;
}