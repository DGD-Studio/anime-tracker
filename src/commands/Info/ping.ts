import { ApplicationCommandTypes, InteractionResponseTypes } from "../../../deps.ts";
import { snowflakeToTimestamp, humanizeMilliseconds } from "../../utils/helpers.ts";
import { createCommand } from "../mod.ts";

createCommand({
    name: "ping",
    description: "Ping the Bot!",
    type: ApplicationCommandTypes.ChatInput,
    scope: "Global",
    execute: async (bot, interaction) => {
        const ping = Date.now() - snowflakeToTimestamp(interaction.id);
        await bot.helpers.sendInteractionResponse(
            interaction.id,
            interaction.token,
            {
                type: InteractionResponseTypes.ChannelMessageWithSource,
                data: {
                    content: `${ping}ms (${humanizeMilliseconds(ping)})`,
                },
            },
        );
    },
});