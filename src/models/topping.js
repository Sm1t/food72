import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const ToppingSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	weight: {
		type: Number,
		required: true
	}
})

export default mongoose.model('Topping', ToppingSchema);