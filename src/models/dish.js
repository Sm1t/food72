import mongoose from 'mongoose';
import Like from './like';
import { Schema } from 'mongoose';
import _ from 'lodash';

// Product Schema
const DishSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	category : {
		type: String
	},
	toppings: [
		{
			toppingId: {
				type: Schema.Types.ObjectId,
				ref: 'Topping',
				required: true
			}
		}
	],
	dishPicture: {
		type: String
	},
	callories: {
		type: Number,
		required: true
	},
	description: {
		type: String
	},
	composition: [
		{
			name: {
				type: String,
				required: true
			},
			quantity: {
				type: String,
				required: true
			}
		}
	],
	weight: {
		type: Number,
		required: true
	},
	conteiner: {
		type: {
			type: String,
			required: true,
		},
		size: {
			type: Number,
			required: true
		},
		price: {
			type: Number,
			required: true
		}
	},
	proteins: {
		type: Number,
		required: true
	},
	carbohydrates: {
		type: Number,
		required: true
	},
	fats: {
		type: Number,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	rating: {
		type: Number,
		default: 5
	},
	likes: {
		type: Number,
		required: true,
		default: 0
	},
	active: {
		type: Boolean,
		default: true,
		required: true
	}
}, {
	timestamps: true
});

export default mongoose.model('Dish', DishSchema);
