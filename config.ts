import { dotEnvConfig, GatewayIntents } from "./deps.ts"

const env = dotEnvConfig({ export: true })

export const GATEWAY_INTENTS: (keyof typeof GatewayIntents)[] = [
    "GuildMembers",
    "Guilds"
]

if (!env.DISCORD_BOT_TOKEN) throw new Error("Discord Token is needed.")
export const DISCORD_BOT_TOKEN = env.DISCORD_BOT_TOKEN

if (!env.MONGO_DB_URL) throw new Error("You need a Mongo Url to uh have a connection")
export const MONGO_DB_URL = env.MONGO_DB_URL

export const DISCORD_BOT_ID = env.DISCORD_BOT_ID ? BigInt(env.DISCORD_BOT_ID) : BigInt(atob(DISCORD_BOT_TOKEN.split(".")[0]))

// THIS IS LAZINESS
export const DEPLOY = true
export const SCOPE: "Global" | "Guild" = "Guild"