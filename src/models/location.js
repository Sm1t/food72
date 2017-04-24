import mongoose from 'mongoose';
const { Schema } = mongoose;

const LocationSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	number: {
		type: Number,
		required: true
	},
	workTime: {
		type: Schema.Types.ObjectId,
		ref: 'Shedule',
		required: true
	}
})

export default mongoose.model('Location', LocationSchema);