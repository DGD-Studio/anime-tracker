import { Client, ClientOptions, Collection, Guild } from 'discord.js';
import BaseEvent from '../utils/structures/BaseEvent';
import BaseCommand from '../utils/structures/BaseCommand';
import Logger from '../utils/logger/logger';
import ms from "ms"
import { Mongoose } from 'mongoose';
import colors from '../json/colors.json';
import axios from 'axios';

export default class DiscordClient extends Client {
	private _commands = new Collection<string, BaseCommand>();
	private _events = new Collection<string, BaseEvent>();
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
	async getAnimeInfo(anime: String) {
		const data = await axios.get(
			`https://kitsu.io/api/edge/anime?filter[text]=${anime}`
		);

		if (data.data.data.length == 0) return null;

		const titles = {
				english: data.data.data[0].attributes.titles.en,
				japanese: data.data.data[0].attributes.titles.en_jp,
			},
			images = {
				posterImage: data.data.data[0].attributes.posterImage.original,
				coverImage: data.data.data[0].attributes.coverImage.original,
			},
			averageRating = data.data.data[0].attributes.averageRating;

		let description =
			data.data.data[0].attributes.description.indexOf('(Source'); // Searchs if the description has the word source in it
		if (description == -1)
			// Checks if it finds query. If it doesn't then it will equal -1 so I will have it check [Written cause there are some MAL descriptions
			description =
				data.data.data[0].attributes.description.indexOf('[Written');
		description = data.data.data[0].attributes.description.substring(
			0,
			description
		);
		return { titles, images, averageRating, description };
	}
	memory(bytes: number, type?: string): number {
        if (type === "gb")
            return Math.round((bytes / 1024 / 1024 / 1000) * 10) / 10;
        else return Math.round((bytes / 1024 / 1024) * 100) / 100;
    }

    timestamp(ms: number): string {
        const sec = Math.floor((ms / 1000) % 60);
        const min = Math.floor((ms / (1000 * 60)) % 60);
        const hrs = Math.floor((ms / (1000 * 60 * 60)) % 24);
        const days = Math.floor((ms / (1000 * 60 * 60 * 24)) % 7);
        const weeks = Math.floor(ms / (1000 * 60 * 60 * 24 * 7));

        return `${weeks ? `${weeks}w ` : ``}${days ? `${days}d ` : ``}${hrs ? `${hrs}h ` : ``
            }${min ? `${min}m ` : ``}${sec ? `${sec}s` : ``}`;
    }

    totalUsers(): number {
        let users: number = 0;
        this.guilds.cache.map((guild: Guild) => {
            if (!guild.memberCount) return;
            else users += guild.memberCount;
        });
        return users;
    }
}
