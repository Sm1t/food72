import mongoose from 'mongoose';
import getUniqueNumber from '../helpers/getUniqueNumber';
const { Schema } = mongoose;
import _ from 'lodash';

const OrderSchema = mongoose.Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	dishes: [
		{
			dishId: {
				type: Schema.Types.ObjectId,
				ref: 'Dish',
				required: true
			},
			quantity: {
				type: Number,
				required: true,
				default: 1
			},
			_id: false
		}
	],
	payStatus: {
		type: Boolean,
		required: true,
		default: false
	},
	completed: {
		type: Boolean,
		required: true,
		default: false
	},
	status: {
		type: String,
		required: true,
		default: 'Обратывается'
	},
	totalPrice: {
		type: Number,
		required: true
	},
	time: {
		type: String,
		required: true
	},
	number: {
		type: Number
	}
}, {
	timestamps: true
});

OrderSchema.pre('save', function(next) {
	return getUniqueNumber()
	.then(unique => {
		this.number = unique;
		next();
	})
	.catch(next)
})

OrderSchema.methods.toJSON = function() {
	return _.pick(this, ['_id', 'userId', 'dishes', 'payStatus', 'completed', 'status', 'totalPrice', 'time', 'number']);
}

export default mongoose.model('Order', OrderSchema);