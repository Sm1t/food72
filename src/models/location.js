import mongoose from 'mongoose';

const LocationSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	number: {
		type: Number,
		required: true
	}
})

export default mongoose.model('Location', LocationSchema);