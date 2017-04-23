import mongoose from 'mongoose';

const MenuSchema = mongoose.Schema({
	dishes: [
		{
			dishId: {
				type: Schema.Types.ObjectId,
				ref: 'Dish',
				required: true
			}
		}
	],
	location: {
		type: String,
		required: true
	}
})

export default mongoose.model('Menu', MenuSchema);