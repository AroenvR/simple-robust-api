import Ajv from 'ajv';
import addFormats from "ajv-formats";
import ValidationError from "../../util/errors/ValidationError";
import { validNumber } from '../../util/isValidUtil';
import { IDTO } from "./IDTO";

/**
 * Base class (parent) for all Data Transfer Objects.
 * @abstract
 * @implements {IDTO}
 */
export default abstract class DataTransferObject implements IDTO {
    private id: number | null = null;
    protected static ajv: Ajv = addFormats(new Ajv());

    get _id(): number {
        return this.id || 0;
    }

    set _id(value: number) {
        validNumber(value);
        this.id = value;
    }

    /**
     * Checks if the provided data matches the schema for the data transfer object.
     * @abstract
     * @param {any} data - The data to validate.
     * @returns {boolean} True if the data is valid.
     * @throws {ValidationError} If the data is invalid.
     */
    protected abstract checkSchema(data: any): boolean;

    /**
     * Checks if the provided data is valid for the data transfer object.
     * @abstract
     * @param {any} data - The data to validate.
     * @returns {boolean} True if the data is valid.
     * @throws {ValidationError} If the data is invalid.
     */
    public abstract isValid(data: any): boolean;

    /**
     * Creates a new instance of the data transfer object from the provided data.
     * @static
     * @param {{ new(): T; prototype: T }} this - Specifies the constructor of the data transfer object.
     * @param {any} data - The data to create the instance from.
     * @returns {T} The new instance of the data transfer object.
     * @throws {ValidationError} If the provided data is invalid.
     * 
     * @example
     * const user = UserDTO.fromData({ id: 1, uuid: '123e4567-e89b-12d3-a456-426614174000', name: 'John Doe' });
     */
    public static fromData<T extends DataTransferObject>(this: { new(): T; prototype: T }, data: any): T {
        const instance = new this();
        if (!instance.isValid(data)) {
            throw new ValidationError('DataTransferObject: Invalid data given to DTO');
        }

        // Set properties of the instance with the provided data
        for (const key in data) {
            if (instance.hasOwnProperty(key) && data.hasOwnProperty(key)) {
                (instance as any)[key] = data[key];
            }
        }

        return instance;
    }
}