import { events } from "./mod.ts"
import { logger } from "../utils/logger.ts"

const log = logger({ name: "Anime Tracker | Debug Event" })

events.debug = (text) => log.debug(text)