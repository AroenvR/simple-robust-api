import Ajv from 'ajv';
import addFormats from "ajv-formats";
import ValidationError from "../../util/errors/ValidationError";
import { validNumber } from '../../util/isValidUtil';
import { IDTO } from "./IDTO";

/**
 * DataTransferObject is a base class for all data transfer objects.
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

    // protected static checkSchema(data: any): boolean {
    //     throw new ValidationError('DataTransferObject: checkSchema not implemented in child class');
    // }

    protected abstract checkSchema(data: any): boolean;

    public abstract isValid(data: any): boolean;

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