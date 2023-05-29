import { isTruthy } from "../../util/isTruthy";
import { IDTO } from "./IDTO";

/**
 * DataTransferObject is a base class for all data transfer objects.
 */
export default abstract class DataTransferObject implements IDTO {
    private id: number | null = null;

    get _id(): number {
        if (this.id === null) {
            throw new Error('DataTransferObject: ID is not set');
        }
        return this.id;
    }

    set _id(value: number) {
        if (value < 1) throw Error('DataTransferObject: ID must be a positive integer');
        if (isTruthy(this.id)) throw Error('DataTransferObject: ID is already set');
        this.id = value;
    }

    /**
     * Checks if the DTO is valid.
     * @returns `true` if the DTO is valid.
     * @throws If the DTO is invalid, a ValidationError is thrown with a specific error message.
     */
    public abstract isValid(): boolean;

    public abstract fromData(data: any): DataTransferObject;
}