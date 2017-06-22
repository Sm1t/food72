import mongoose from 'mongoose';

const QrSchema = mongoose.Schema({
	number: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	category: {
		type: String,
		required: true
	},
	date: {
		type: String,
		required: true
	},
	receipt: {
		type: String,
		required: true
	},
	comment: {
		type: String,
		required: true
	},
	status: {
		type: String,
		required: true
	},
	unit: {
		type: String,
		required: true
	},
	auditory: {
		type: String,
		required: true
	},
	type: {
		type: String,
		required: true
	},
	picture: {
		type: String,
		default: ''
	}
})

export default mongoose.model('Qr', QrSchema);