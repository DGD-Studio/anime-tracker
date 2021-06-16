import { Document, model, Schema } from 'mongoose';

export interface Anime {
	titles: { english: String; japanese: String };
	images: { posterImage: String; coverImage: String };
	averageRating: String;
	description: String;
}
export interface IUser extends Document {
	id: String;
	watching: Array<Anime>;
	completed: Array<Anime>;
	planToWatch: Array<Anime>;
}

const UserSchema: Schema = new Schema({
	id: {
		type: String,
		required: true,
		unique: true,
	},
	watching: {
		type: Object,
		required: false,
		unique: false,
	},
	completed: {
		type: Object,
		required: false,
		unique: false,
	},
	planToWatch: {
		type: Object,
		required: false,
		unique: false,
	},
});

export default model<IUser>('User', UserSchema);
