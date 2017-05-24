import mongoose from 'mongoose';
import _ from 'lodash';
const { Schema } = mongoose;

const LikeSchema = mongoose.Schema({
	dish: {
		type: Schema.Types.ObjectId,
		ref: 'Dish',
		required: true
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'Dish',
		required: true
	},
}, {
	timestamps: true
});

LikeSchema.methods.toJSON = function() {
	return _.pick(this, ['dish', 'user']);
}

export default mongoose.model('Like', LikeSchema);

