import { config } from 'dotenv-safe';
config();
import { registerCommands, registerEvents } from './utils/registry';
import DiscordClient from './client/client';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
const client = new DiscordClient({});

(async () => {
	if (process.env.SENTRY_KEY) {
		Sentry.init({
			dsn: 'https://042cdd0c831c42948d773b910e0fb70c@o457285.ingest.sentry.io/5820357',
			tracesSampleRate: 1.0,
			integrations: [new Tracing.Integrations.Mongo()],
		});
	}
	await registerCommands(client, '../commands');
	await registerEvents(client, '../events');
	await client.login(process.env.DISCORD_BOT_TOKEN);
})();
