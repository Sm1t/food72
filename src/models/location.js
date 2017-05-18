import mongoose from 'mongoose';
const { Schema } = mongoose;

const daySchema = new Schema({
	workingHours: {
		type: String,
		required: true
	},
	break: [
		{
			type: String,
			required: true
		}
	]
}, {
	_id: false
})

const LocationSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	number: {
		type: Number,
		required: true
	},
	workingTime: {
		monday: daySchema,
		tuesday: daySchema,
		wednesday: daySchema,
		thursday: daySchema,
		friday: daySchema,
		saturday: daySchema,
	}
}, {
	timestamps: true
})

export default mongoose.model('Location', LocationSchema);