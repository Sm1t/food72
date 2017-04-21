import mongoose from 'mongoose';
const { Schema } = mongoose;

const LikeSchema = mongoose.Schema({
	dishId: {
		type: Schema.Types.ObjectId,
		ref: 'Dish',
		required: true
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	}
});

export default mongoose.model('Like', LikeSchema);

