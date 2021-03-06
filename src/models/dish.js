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
			topping: {
				type: Schema.Types.ObjectId,
				ref: 'Topping'
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


DishSchema.methods.toJSON = function() {
	return _.omit(this.toObject(), ['updatedAt', 'createdAt'])
}

DishSchema.methods.updateLikesCount = function() {
	const dish = this;
	return Like.count({dish: dish._id}).then(count => {
		dish.likes = count;
		return dish.save();
	});
}


export default mongoose.model('Dish', DishSchema);
