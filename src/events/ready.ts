import { events } from "./mod.ts"
import { Bot, editBotStatus, ActivityTypes } from "../../deps.ts"
import { logger } from "../utils/logger.ts"

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
}