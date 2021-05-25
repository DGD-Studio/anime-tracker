import { Document, model, Schema } from 'mongoose';

export interface IUser extends Document {
	id: String;
}

const UserSchema: Schema = new Schema({
	id: {
		type: String,
		required: true,
		unique: true,
	},
	animes: {
		type: Object,
		required: false,
		unique: false,
	},
});

export default model<IUser>('User', UserSchema);
