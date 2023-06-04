// import { Client } from 'discord.js';
import { IEntity } from "../IEntity";

export interface IDiscordBot extends IEntity {
    _name: string;
    _tag: string;
    _token: string;
    // _client: Client;
}