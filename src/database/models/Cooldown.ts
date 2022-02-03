/** export interface ICooldown extends Document {
	id: string;
	command: string;
	expirationTime: number;
}

const CooldownSchema: Schema = new Schema({
	id: {
		type: String,
		required: true,
	},
	command: {
		type: String,
		required: true,
	},
	expirationTime: {
		type: Number,
		required: true,
	},
});

export default model<ICooldown>('Cooldowns', CooldownSchema);*/


