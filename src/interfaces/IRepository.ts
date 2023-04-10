export interface IRepository {
    name: string;
    upsert(params?: any[]): Promise<any>;
    selectAll(): Promise<any[]>;
    getLast(): Promise<any>;
}