import { Client, GatewayIntentBits, Events, Message } from 'discord.js';
import Entity from "./Entity";
import { IDiscordBot } from './IDiscordBot';
import Logger from '../../util/logging/Logger';

/*  [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent
    ] */

export class DiscordBot extends Entity implements IDiscordBot {
    private name: string;
    private tag: string;
    private token: string;
    private client: Client;
    private timeout: NodeJS.Timeout | null = null;

    constructor(id: number | null, name: string, tag: string, token: string, intents: GatewayIntentBits[]) {
        super(id);
        this.name = name;
        this.tag = tag;
        this.token = token;

        this.client = new Client({ intents: intents }); // TODO: Check other possible intents

        // client = new Client({ check for other possible intents?
        //     intents: [
        //         GatewayIntentBits.GUILDS,
        //         GatewayIntentBits.GUILD_MESSAGES,
        //         GatewayIntentBits.GUILD_MESSAGE_REACTIONS,
        //         GatewayIntentBits.GUILD_MESSAGE_TYPING,
        //         GatewayIntentBits.DIRECT_MESSAGES,
        //         GatewayIntentBits.DIRECT_MESSAGE_REACTIONS,
        //         GatewayIntentBits.DIRECT_MESSAGE_TYPING,
        //     ],
        // });
    }

    public async setup() {
        this.client.on(Events.ClientReady, () => {
            Logger.instance.debug(`DiscordBot: ${this.name} is ready!`);
        });

        this.client.login(this.token);
    }

    public async sendContent(message: Message, content: string, reply?: boolean) {
        this.startTyping(message);
        let chunks = await this.splitMessage(content); // Discord has a 2000 character limit per message.

        for (const chunk of chunks) {
            if (reply) await message.reply(chunk);
            else await message.channel.send(chunk);
        }

        this.stopTyping();
    }

    private async startTyping(message: Message) {
        const start = Date.now();  // Get the current time
        const limit = 30000;       // Set the limit to 30 seconds

        this.timeout = setInterval(() => {
            if (Date.now() - start < limit) {
                message.channel.sendTyping();
            } else {
                this.stopTyping();  // Stop typing when limit is reached
            }
        }, 9500); // Repeat every 9.5 seconds
    }

    private async stopTyping() {
        if (this.timeout === null) return;

        clearInterval(this.timeout);
        this.timeout = null;
    }

    get _name(): string {
        return this.name;
    }

    get _tag(): string {
        return this.tag;
    }

    get _token(): string {
        return this.token;
    }

    get _client(): Client {
        return this.client;
    }

    private async splitMessage(content: string): Promise<string[]> {
        const maxLength = 1999;
        let chunks: string[] = [];

        if (content.length <= maxLength) {
            chunks.push(content);
        } else {
            while (content.length > 0) {
                let chunk = content.slice(0, maxLength);
                chunks.push(chunk);
                content = content.slice(maxLength);
            }
        }

        return chunks;
    }

    // setup client
    // start client
    // log client
    // handle message (& emit)
    // utilities?
}