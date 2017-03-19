import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const CommentSchema = mongoose.Schema({
	dish: {
		type: Schema.Types.ObjectId,
		ref: 'Dish',
		required: true
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	text: {
		type: String,
		required: true
	},
	rating: {
		type: Number,
		required: true
	}
}, {
	timestamps: true
})

export default mongoose.model('Comment', CommentSchema);