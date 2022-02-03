import { Document } from "../../../deps.ts"

export interface Anime {
	titles: { english: string; japanese: string };
	images: { posterImage: string; coverImage: string };
	averageRating: string;
	description: string;
}

export interface UserSchema extends Document {
	_id: string;
	watching: Array<Anime>;
	completed: Array<Anime>;
	planToWatch: Array<Anime>;
}