import fs from 'fs-extra';
import path from 'path';
import { isTruthy } from "../../../util/isTruthy";
import Entity from "../Entity";
import { IOpenAI } from './IOpenAI';

// interface IOpenAIConfig {
//     replace: boolean;
//     symbols?: string[];
//     replacements?: string[];
// }

export class OpenAI extends Entity implements IOpenAI {
    private name: string;
    private model: "gpt-3.5-turbo" | "gpt-4";
    // private primer: string;

    constructor(id: number | null, name: string, model: "gpt-3.5-turbo" | "gpt-4" = "gpt-3.5-turbo") { // , config: IOpenAIConfig
        super(id);
        this.name = name;
        this.model = model;
        // this.primer = this.defaultPrimer(config);
    }

    get _name(): string {
        return this.name;
    }

    get _model(): "gpt-3.5-turbo" | "gpt-4" {
        return this.model;
    }

    // get _primer(): string {
    //     return this.primer;
    // }

    // set _primer(value: string) {
    //     this.primer = value;
    // }

    // private defaultPrimer(config: IOpenAIConfig): string {
    //     const filePath = path.join(__dirname, 'ai_class_prompts', this.name.toLowerCase(), `${this.name}.AI`);
    //     const fileContents = fs.readFileSync(filePath, 'utf-8');

    //     let primer = fileContents;

    //     // Replace symbols with strings for primer scaling
    //     if (config.replace && isTruthy(config.symbols) && isTruthy(config.replacements)) {
    //         for (let i = 0; i < config.replacements!.length; i++) {
    //             const replacement = config.replacements![i];
    //             primer = fileContents.replace(new RegExp(config.symbols![i], "g"), replacement);
    //         }
    //     }

    //     return primer;
    // }
}

