import mongoose from 'mongoose';
const { Schema } = mongoose;

const MenuSchema = mongoose.Schema({
	dishes: [
		{
			dish: {
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