import Entity from "../Entity";
import { IUser } from "./IUser";

/**
 * User Entity.
 * @extends {Entity} - The parent of all Entities.
 * @implements {IUser}
 */
export class User extends Entity implements IUser {
    private uuid: string;
    private name: string;

    constructor(id: number | null, uuid: string, name: string) {
        super(id);
        this.uuid = uuid;
        this.name = name;
    }

    get _uuid(): string {
        return this.uuid;
    }

    get _name(): string {
        return this.name;
    }
}