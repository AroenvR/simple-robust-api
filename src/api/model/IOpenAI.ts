import { IEntity } from "./IEntity";

export interface IOpenAI extends IEntity {
    _name: string;
    _model: "gpt-3.5-turbo" | "gpt-4";
    _primer: string;
}