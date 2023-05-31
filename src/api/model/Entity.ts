import { IEntity } from "./IEntity";

export default abstract class Entity implements IEntity {
    private id: number | null;

    constructor(id: number | null) {
        this.id = id;
    }

    get _id(): number {
        if (this.id === null) throw Error('Entity: ID is not set');
        return this.id!;
    }
}