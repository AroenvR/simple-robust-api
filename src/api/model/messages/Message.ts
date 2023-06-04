import Entity from "../Entity";

export class Message extends Entity {
    private author: "system" | "assistant" | "user";
    private content: string;
    private timestamp: number;
    // private channel: string;
    // private guild: string;

    constructor(id: number | null, content: string, author: "system" | "assistant" | "user") {
        super(id);
        this.content = content;
        this.author = author;
        this.timestamp = new Date().getTime();
    }

    get _author(): string {
        return this.author;
    }

    get _content(): string {
        return this.content;
    }

    get _timestamp(): number {
        return this.timestamp;
    }
}