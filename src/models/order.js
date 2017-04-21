import mongoose from 'mongoose';
const { Schema } = mongoose;

const OrderSchema = mongoose.Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
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
			}
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
	}
}, {
	timestamps: true
});

export default mongoose.model('Order', OrderSchema);