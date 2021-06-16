import { Document, Schema, model } from 'mongoose';

export interface IGuild extends Document {
	id: string;
	prefix: string;
}

const GuildSchema: Schema = new Schema({
	id: {
		type: String,
		required: true,
		unique: true,
	},
	prefix: {
		type: String,
		required: true,
		unique: false,
		default: process.env.DISCORD_BOT_PREFIX,
	},
});

export default model<IGuild>('Guild', GuildSchema);
