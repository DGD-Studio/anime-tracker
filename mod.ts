import { createBot, startBot, enableCachePlugin, enableCacheSweepers, fastFileLoader } from "./deps.ts"
import { DISCORD_BOT_TOKEN, DISCORD_BOT_ID, GATEWAY_INTENTS } from "./config.ts"
import { events } from "./src/events/mod.ts"
import { dbOperations } from "./src/database/mod.ts"
import { logger } from "./src/utils/logger.ts"

const log = logger({ name: "Anime Tracker" })

log.info(`Starting bot...`)
const paths = ["./src/events", "./src/commands"];
await fastFileLoader(paths).catch((err) => {
    log.fatal(`Unable to Import ${paths}`);
    log.fatal(err);
    Deno.exit(1);
});
export const bot = enableCachePlugin(
    createBot({
        token: DISCORD_BOT_TOKEN,
        botId: DISCORD_BOT_ID,
        applicationId: DISCORD_BOT_ID,
        intents: GATEWAY_INTENTS,
        events: events,
    })
)
enableCacheSweepers(bot)
export const db = await dbOperations()
startBot(bot)