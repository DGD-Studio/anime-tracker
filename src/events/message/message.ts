import BaseEvent from '../../utils/structures/BaseEvent';
import { Message } from 'discord.js';
import DiscordClient from '../../client/client';
import User from '../../models/User';
import Guild from '../../models/Guild';
import Cooldown from '../../models/Cooldown';

export default class MessageEvent extends BaseEvent {
	constructor() {
		super('message');
	}

	async run(client: DiscordClient, message: Message) {
		const mentionRegex = RegExp(`^<@!?${client.user.id}>$`),
			mentionRegexPrefix = RegExp(`^<@!?${client.user.id}> `);

		if (message.author.bot || message.channel.type == 'dm') return;
		let guildData = await Guild.findOne({ id: message.guild.id });
		if (!guildData) {
			guildData = await Guild.create({ id: message.guild.id });

			guildData.save().catch((err) => {
				client.logger.error(err);
				return message.channel.send(
					'Error with database, report to dev when.'
				);
			});
		}

		if (message.content.match(mentionRegex))
			return message.channel.send('', {
				embed: {
					title: ':wave: You pinged me!',
					description: `My prefix is \`${process.env.DISCORD_BOT_PREFIX}\`! Try running \`${process.env.DISCORD_BOT_PREFIX} help\`!`,
					color: client.randomColor(),
				},
			});

		const prefix = message.content.match(mentionRegexPrefix)
			? message.content.match(mentionRegexPrefix)[0]
			: message.content.match(process.env.DISCORD_BOT_PREFIX)
			? process.env.DISCORD_BOT_PREFIX
			: guildData.prefix;

		if (message.content.startsWith(prefix)) {
			let member = await User.findOne({ id: message.author.id });
			if (!member) {
				member = await User.create({ id: message.author.id });

				member.save().catch((err) => {
					return message.channel.send(`There was an error!`);
				});
			}
			const [cmdName, ...cmdArgs] = message.content
					.slice(prefix.length)
					.trim()
					.split(/\s+/),
				command =
					client.commands.get(cmdName) ||
					client.commands.find(
						(cmd) =>
							cmd.getAliases() &&
							cmd.getAliases().includes(cmdName)
					);
			if (command) {
				const cd = await Cooldown.findOne({
						id: message.author.id,
						command: command.getName(),
					}),
					now = Date.now();
				console.log(cd);
				if (cd) {
					if (now > cd.expirationTime) {
						cd.delete();
						try {
							let flags = parseOptions(cmdArgs).flags;
							command.run(client, message, cmdArgs, flags);
						} catch (err) {
							return message.channel.send(
								`There was an error: ${err}`
							);
						}
					} else {
						return message.channel.send(
							`Wait ${((cd.expirationTime - now) / 1e3).toFixed(
								1
							)} second(s) please!`
						);
					}
				} else {
					try {
						const makeCooldown = await Cooldown.create({
							id: message.author.id,
							command: command.getName(),
							expirationTime:
								Date.now() + command.getCooldown() * 1e3,
						});
						makeCooldown.save();
						setTimeout(async () => {
							await Cooldown.findOneAndDelete({
								id: message.author.id,
								command: command.getName(),
							});
						}, command.getCooldown() * 1e3);
						const flags = parseOptions(cmdArgs).flags;
						command.run(client, message, cmdArgs, flags);
					} catch (err) {
						return message.channel.send(
							`There was an error: ${err}`
						);
					}
				}
			}
		}
	}
}

function parseOptions(args) {
	if (
		!Array.isArray(args) ||
		!args.every((argument) => typeof argument === 'string')
	)
		throw new TypeError(
			'First parameter must be an array and every element must be a type of string'
		);

	let matches = args.filter((a) => a.startsWith('--')),
		joined = args.join(' '),
		output = {
			options: {},
			flags: [],
			contentNoOptions: joined,
			contentNoFlags: joined,
		};
	if (!matches.length) return output;
	for (let match of matches) {
		let m = args.slice(args.indexOf(match) + 1),
			s = [];
		for (let index of m) {
			if (index.startsWith('--')) break;
			s.push(index);
		}
		if (s.length) {
			output.options[match.slice(2)] = s.join(' ');
		} else {
			output.flags.push(match.slice(2));
		}
	}
	let x = joined.indexOf(matches[0]);
	output.contentNoOptions = x <= 0 ? '' : joined.slice(0, x - 1);
	output.contentNoFlags =
		x === -1 ? '' : args.filter((arg) => !arg.startsWith('--')).join(' ');
	return output;
}
