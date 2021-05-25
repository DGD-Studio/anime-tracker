import { Message, MessageEmbed } from 'discord.js';
import BaseCommand from '../../utils/structures/BaseCommand';
import DiscordClient from '../../client/client';
import User from '../../models/User';

export default class PingCommand extends BaseCommand {
	constructor() {
		super('ping', 'Information', ['latency']);
	}

	async run(client: DiscordClient, message: Message, args: Array<string>, _) {
		let ping = Date.now(),
			circles = {
				green: ':green_circle:',
				red: ':red_circle:',
				yellow: ':yellow_circle:',
			};
		await User.findOne();
		ping = Date.now() - ping;
		const msg = await message.channel.send('Pinging...'),
			embed = new MessageEmbed()
				.setTitle(':ping_pong: Pong!')
				.addField(
					'Client ping: ',
					`${
						client.ws.ping <= 200
							? circles.green
							: client.ws.ping <= 400
							? circles.yellow
							: circles.red
					} ${client.ws.ping}ms`
				)
				.addField(
					'Database ping: ',
					`${
						ping <= 200
							? circles.green
							: ping <= 400
							? circles.yellow
							: circles.red
					} ${ping}ms`
				)
				.setColor(client.randomColor());

		return msg.edit('', embed);
	}
}
