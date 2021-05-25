import { config } from 'dotenv-safe';
config();
import { registerCommands, registerEvents } from './utils/registry';
import DiscordClient from './client/client';
const client = new DiscordClient({});

(async () => {
	await registerCommands(client, '../commands');
	await registerEvents(client, '../events');
	await client.login(process.env.DISCORD_BOT_TOKEN);
})();
