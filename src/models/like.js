import mongoose from 'mongoose';
import _ from 'lodash';
const { Schema } = mongoose;

const LikeSchema = mongoose.Schema({
	dishId: {
		type: Schema.Types.ObjectId,
		ref: 'Dish',
		required: true
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'Dish',
		required: true
	},
}, {
	timestamps: true
});

LikeSchema.methods.toJSON = function() {
	return _.pick(this, ['dishId', 'userId']);
}

export default mongoose.model('Like', LikeSchema);

