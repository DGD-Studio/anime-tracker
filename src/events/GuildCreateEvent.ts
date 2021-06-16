// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildCreate
import { Guild } from 'discord.js';
import BaseEvent from '../utils/structures/BaseEvent';
import DiscordClient from '../client/client';
import guildData from '../models/Guild';

export default class GuildCreateEvent extends BaseEvent {
	constructor() {
		super('guildCreate');
	}

	async run(client: DiscordClient, guild: Guild) {
		let data = await guildData.findOne({ id: guild.id });
		if (!data) {
			data = await guildData.create({ id: guild.id });

			data.save().catch((e) => client.logger.error(e));
		}
		const log = await guild.fetchAuditLogs({
				limit: 1,
				type: 'BOT_ADD',
			}),
			addBotLog = log.entries.first(),
			{ executor } = addBotLog;
		return client.logger.info(
			`${executor.tag} added the bot to ${guild.name}!`
		);
	}
}
