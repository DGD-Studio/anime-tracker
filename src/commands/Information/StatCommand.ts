export default class StatCommand extends BaseCommand {
  constructor() {
    super(
      'stat',
      'Information',
      ["stats", "botinfo"],
      "Displays Stats about the bot",
      [],
      5,
      {
        bot: ["EMBED_LINKS"],
      }
    );
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const statEmbed = new MessageEmbed()
    .setColor(client.randomColor())
    .setAuthor(`${client.user.username}'s Stats`, client.user.displayAvatarURL())
    .addField("Bot", `Guilds: ${client.guilds.cache.size}\nUsers: ${client.totalUsers()} (${client.users.cache.size} are cached)\nPing: ${client.ws.ping}\nUptime: ${client.timestamp(client.uptime)}\nVersion: ${Botv}\nDjs: ${djsv}`)
    .addField("System Stats", `Host: ${os.platform()}\nMemory Usage: ${client.memory(process.memoryUsage().rss)}MB/${Math.round(client.memory(os.totalmem(), "gb"))}GB (${Math.round((process.memoryUsage().rss / os.totalmem()) * 1000) / 10}%)`)
    return message.channel.send(statEmbed)
  }
}
