import { IEntity } from "../model/IEntity";
import { isTruthy } from "../../util/isTruthy";

/**
 * DataTransferObject is a base class for all data transfer objects.
 */
export default abstract class DataTransferObject implements IEntity {
    private _id: number | null = null;

    get id(): number {
        if (this._id === null) {
            throw new Error('DataTransferObject: ID is not set');
        }
        return this._id;
    }

    set id(value: number) {
        if (value < 1) throw Error('DataTransferObject: ID must be a positive integer');
        if (isTruthy(this._id)) throw Error('DataTransferObject: ID is already set');
        this._id = value;
    }
}