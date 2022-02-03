import { events } from "./mod.ts"
import { Bot, editBotStatus, ActivityTypes } from "../../deps.ts"
import { logger } from "../utils/logger.ts"
import { updateCommands } from "../utils/helpers.ts"
import { DEPLOY, SCOPE } from "../../config.ts"
import { bot } from "../../mod.ts"

const log = logger({ name: "Anime Tracker | Ready Event" })

events.ready = (denobot: Bot, _payload) => {
    log.info(`Bot is online`)
    editBotStatus(denobot, {
        status: "idle",
        activities: [
            {
                type: ActivityTypes.Watching,
                name: "Your favourite Animes",
                createdAt: Date.now()
            }
        ]
    })
    if (DEPLOY) updateCommands(bot, SCOPE)
}