import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import updateRating from '../helpers/updateRating';

const CommentSchema = mongoose.Schema({
	dish: {
		type: Schema.Types.ObjectId,
		ref: 'Dish',
		required: true
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User'
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


CommentSchema.post('save', function(next) {
	return updateRating(this.dish, this.rating)
	.catch(next);
});

export default mongoose.model('Comment', CommentSchema);