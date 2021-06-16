import BaseEvent from '../../utils/structures/BaseEvent';
import DiscordClient from '../../client/client';
import { connect } from 'mongoose';

export default class ReadyEvent extends BaseEvent {
	constructor() {
		super('ready');
	}
	async run(client: DiscordClient) {
		client.logger.info('Bot has logged in.');
		connect(process.env.MONGO_DB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		})
			.then(() => client.logger.info('Connected to database!'))
			.catch((err) =>
				client.logger.error('Failed to connect to database!')
			);
		client.user.setPresence({
			activity: {
				name: `Anime in ${client.guilds.cache.size} servers`,
				type: 'WATCHING',
			},
			status: 'dnd',
		});
	}
}
