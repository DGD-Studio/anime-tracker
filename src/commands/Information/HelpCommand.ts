import { Message, MessageEmbed } from 'discord.js';
import BaseCommand from '../../utils/structures/BaseCommand';
import DiscordClient from '../../client/client';
import converter from 'number-to-words';

export default class HelpCommand extends BaseCommand {
	constructor() {
		super('help', 'Information', [], 'Get information about a command!');
	}

	async run(client: DiscordClient, message: Message, args: Array<string>) {
		if (args[0]) {
		} else {
			let number = 1;
			const com = {},
				embed = new MessageEmbed()
					.setTitle('Anime Tracker - Help Command')
					.setColor(client.randomColor()),
				arr = [],
				emojis = ['🗑', '⏪', '⬅️', '➡️', '⏩'],
				embeds = [];
			embeds.push(embed);
			for (let e of client.commands.array()) {
				let category = e.getCategory() || 'None';
				if (!com[category]) {
					com[category] = `**${converter.toOrdinal(
						number
					)}** page: ${category}`;
				}
				number += 1;
			}
			let categories = Object.keys(com);
			embed.setFooter(`Page 1/${categories.length + 1}`);
			categories.forEach((category) => {
				let commands = client.commands.filter(
						(xd) => xd.getCategory() === category
					),
					commandEmbed = new MessageEmbed()
						.setTitle(`Commands for the ${category} category!`)
						.setColor(client.randomColor())
						.setFooter(
							`Page ${embeds.length + 1}/${categories.length + 1}`
						),
					commandArr = [];
				commands.forEach((command) => {
					if (!commandArr.includes(command.getName())) {
						commandArr.push(command.getName());
						commandEmbed.addField(
							`**${command.getName()}**`,
							command.getDescription()
						);
					}
				});
				embeds.push(commandEmbed);
			});
			categories.forEach((e) => arr.push(com[e]));
			embed.setDescription(arr.join('\n'));
			const msg = await message.channel.send(embed);
			emojis.forEach(async (emoji) => {
				await msg.react(emoji);
			});
			const filter = (reaction, user) =>
					emojis.includes(reaction.emoji.name) &&
					user.id === message.author.id,
				collector = msg.createReactionCollector(filter, { time: 6e4 });
			let i = 0;
			collector
				.on('collect', async (reaction, user) => {
					reaction.users.remove(user);
					switch (reaction.emoji.name) {
						case emojis[0]:
							collector.emit('end');
							msg.delete({ timeout: 2e3 });
							break;
						case emojis[1]:
							if (i === 0) return;
							i = 0;
							msg.edit(embeds[i]);
							break;
						case emojis[2]:
							if (i === 0) return;
							i--;
							msg.edit(embeds[i]);
							break;
						case emojis[3]:
							if (i === embeds.length - 1) return;
							i++;
							msg.edit(embeds[i]);
							break;
						case emojis[4]:
							if (i === embeds.length - 1) return;
							i = embeds.length - 1;
							msg.edit(embeds[i]);
					}
				})
				.on('end', () => {
					msg.reactions
						.removeAll()
						.then(() =>
							msg.edit(
								'*This message is now inactive and cannot be used.*'
							)
						);
				});
		}
	}
}
