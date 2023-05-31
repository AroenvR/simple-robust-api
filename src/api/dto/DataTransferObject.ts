import { IDTO } from "./IDTO";

/**
 * DataTransferObject is a base class for all data transfer objects.
 */
export default abstract class DataTransferObject implements IDTO {
    private id: number | null = null;

    get _id(): number {
        return this.id || 0;
    }

    set _id(value: number) {
        this.id = value;
    }

    /**
     * Checks if the DTO is valid.
     * @returns `true` if the DTO is valid.
     * @throws If the DTO is invalid, a ValidationError is thrown with a specific error message.
     */
    public abstract isValid(data: any): boolean;

    public abstract fromData(data: any): IDTO;
}