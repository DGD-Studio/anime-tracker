import { Client, ClientOptions, Collection } from 'discord.js';
import BaseEvent from '../utils/structures/BaseEvent';
import BaseCommand from '../utils/structures/BaseCommand';
import Logger from '../utils/logger/logger';
import { Mongoose } from 'mongoose';
import colors from '../json/colors.json';

export default class DiscordClient extends Client {
	public _commands = new Collection<string, BaseCommand>();
	private _events = new Collection<string, BaseEvent>();
	private _prefix: string = '!';
	public logger: Logger;
	public db: Mongoose;

	constructor(options?: ClientOptions) {
		super(options);
		this.logger = new Logger();
	}

	get commands(): Collection<string, BaseCommand> {
		return this._commands;
	}
	get events(): Collection<string, BaseEvent> {
		return this._events;
	}
	randomColor() {
		const keys = Object.keys(colors),
			randomIndex = Math.floor(Math.random() * keys.length),
			randomKey = keys[randomIndex],
			randomColor = colors[randomKey];
		return randomColor;
	}
}
