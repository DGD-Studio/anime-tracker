import { Message, MessageEmbed } from 'discord.js';
import BaseCommand from '../../utils/structures/BaseCommand';
import DiscordClient from '../../client/client';
import converter from 'number-to-words';
import didYouMean from 'didyoumean';

export default class HelpCommand extends BaseCommand {
	constructor() {
		super(
			'help',
			'Information',
			[],
			'Get information about a command!',
			['anime help', 'anime help <command>'],
			5
		);
	}

	async run(client: DiscordClient, message: Message, args: Array<string>) {
		if (args[0]) {
			let command = client.commands.get(args[0]);
			if (!command) {
				let cmdArr = [];
				client.commands.array().forEach((cmd) => {
					if (!cmdArr.includes(cmd.getName())) {
						cmdArr.push(cmd.getName());
					}
				});
				let dym = didYouMean(args[0], cmdArr),
					dymCommand = '';
				if (dym !== null) {
					if (typeof dym == 'string') dymCommand = dym;
					else {
						if (dym.length !== 0) dymCommand = dym[0];
					}
					const msg = await message.channel.send(
							new MessageEmbed()
								.setTitle(`Did not find command ${args[0]}!`)
								.setDescription(
									`Did you mean \`${dymCommand}\`?`
								)
								.setFooter(
									'React to this message with one of the options within 5 seconds.'
								)
								.setColor(client.randomColor())
						),
						emojis = ['❌', '✅'];
					emojis.forEach(async (emoji) => {
						await msg.react(emoji);
					});
					const filter = (reaction, user) =>
							emojis.includes(reaction.emoji.name) &&
							user.id === message.author.id,
						reaction = await msg
							.awaitReactions(filter, { max: 1, time: 5e3 })
							.then(
								(collected) =>
									collected.first() &&
									collected.first().emoji.name
							);
					setTimeout(() => {
						if (!reaction)
							return msg.edit(
								`*This message is now inactive. Please run the command again.*`
							);
					}, 5e3);
					switch (reaction) {
						case emojis[0]:
							msg.reactions
								.removeAll()
								.then((mg) => msg.delete({ timeout: 2e3 }));
							break;
						case emojis[1]:
							msg.reactions.removeAll().then((mg) => {
								const commandName =
									client.commands.get(dymCommand);
								let aliases;
								if (commandName.getAliases().length == 0)
									aliases =
										'Aliases are not provided for this command';
								else
									aliases = commandName
										.getAliases()
										.map((c) => `\`${c}\``)
										.join(', ');
								const commandEmbed = new MessageEmbed()
									.setTitle(
										`The help menu for the command ${commandName.getName()}`
									)
									.setThumbnail(
										client.user.displayAvatarURL({
											dynamic: true,
										})
									)
									.setColor(client.randomColor())
									.addField(
										'Category',
										commandName.getCategory()
									)
									.addField(
										'**Description**',
										commandName.getDescription().length
											? commandName.getDescription()
											: 'A description is not provided for this command'
									)
									.addField('Aliases', aliases)
									.addField(
										'Usage',
										commandName.getUsage().length
											? commandName
													.getUsage()
													.map((e) => `\`${e}\``)
													.join(', ')
											: 'A usage is not provided for this command'
									)
									.addField(
										'Cooldown',
										commandName.getCooldown()
											? `${commandName.getCooldown()} seconds`
											: 'No cooldown for this command'
									)
									.setFooter(
										'[Required Arguments] <Optional Arguments>'
									);
								return msg.edit('', commandEmbed);
							});
							break;
					}
				} else {
					return message.channel.send(
						'That command was not found on this bot.'
					);
				}
			} else {
				let aliases;
				if (command.getAliases().length == 0)
					aliases = 'Aliases are not provided for this command';
				else
					aliases = command
						.getAliases()
						.map((c) => `\`${c}\``)
						.join(', ');
				const commandEmbed = new MessageEmbed()
					.setTitle(
						`The help menu for the command ${command.getName()}`
					)
					.setThumbnail(
						client.user.displayAvatarURL({
							dynamic: true,
						})
					)
					.setColor(client.randomColor())
					.addField('Category', command.getCategory())
					.addField(
						'**Description**',
						command.getDescription().length
							? command.getDescription()
							: 'A description is not provided for this command'
					)
					.addField('Aliases', aliases)
					.addField(
						'Usage',
						command.getUsage().length
							? command
									.getUsage()
									.map((e) => `\`${e}\``)
									.join(', ')
							: 'A usage is not provided for this command'
					)
					.addField(
						'Cooldown',
						command.getCooldown()
							? `${command.getCooldown()} seconds`
							: 'No cooldown for this command'
					)
					.setFooter('[Required Arguments] <Optional Arguments>');
				return message.channel.send(commandEmbed);
			}
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
				msg.react(emoji);
			});
			const filter = (reaction, user) =>
					emojis.includes(reaction.emoji.name) &&
					user.id === message.author.id,
				collector = msg.createReactionCollector(filter, { time: 6e4 });
			let i = 0,
				type = 0;
			collector
				.on('collect', async (reaction, user) => {
					reaction.users.remove(user);
					switch (reaction.emoji.name) {
						case emojis[0]:
							collector.emit('end');
							type = 1;
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
					switch (type) {
						case 1:
							msg.reactions
								.removeAll()
								.then(() =>
									msg.edit(
										'*This message is now inactive and cannot be used.*'
									)
								);
							break;
						default:
							msg.edit(
								'*This message is now inactive and cannot be used.*'
							);
					}
				});
		}
	}
}
