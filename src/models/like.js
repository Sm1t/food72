import mongoose from 'mongoose';
const { Schema } = mongoose;

const LikeSchema = mongoose.Schema({
	dish: {
		type: Schema.Types.ObjectId,
		ref: 'Dish',
		required: true
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	}
});


export default mongoose.model('Like', LikeSchema);

