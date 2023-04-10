/**
 * IRepository interface represents the basic structure for a repository.
 * It contains methods to upsert, select all, and get the last record from the database.
 */
export interface IRepository {
    name: string;
    upsert(params?: any[]): Promise<any>;
    selectAll(): Promise<any[]>;
    getLast(): Promise<any>;
}