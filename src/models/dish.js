import mongoose from 'mongoose';
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
	locations: [
		{
			locationId: {
				type: Schema.Types.ObjectId,
				ref: 'Location',
				required: true
			}
		}
	],
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
	active: {
		type: Boolean,
		default: true,
		required: true
	}
}, {
	timestamps: true
});

/*DishSchema.methods.toJSON = function() {
	
}*/

export default mongoose.model('Dish', DishSchema);
