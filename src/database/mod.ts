import { MongoClient } from "../../deps.ts"
import { MONGO_DB_URL } from "../../config.ts"
import { logger } from "../utils/logger.ts"
import { UserSchema } from "./models/User.ts"

const log = logger({ name: "Anime Tracker | Database" })

const dbClient = new MongoClient()

const connectDbClient = () => {
    log.info(`Connnecting to the database`)
    return dbClient.connect(MONGO_DB_URL).then((_db) => log.info(`Connected`))
}

export async function dbOperations() {
    await connectDbClient()
    const db = dbClient.database("main")
    return {
        db,
        users: db.collection<UserSchema>("users")
    }
}