import mongoose from 'mongoose';
const { Schema } = mongoose;

const daySchema = new Schema({
	workTime: {
		type: String,
		required: true
	},
	break: [
		{
			type: String,
			required: true
		}
	]
})



const SheduleSchema = mongoose.Schema({
	monday: {
		workTime: {
			type: String,
			required: true
		},
		break: [
			{
				type: String,
				required: true
			},
		]
	},
	tuesday: {
		workTime: {
			type: String,
			required: true
		},
		break: [
			{
				type: String,
				required: true
			},
		]
	}
	//tuesday: [...daySchema],
	//wednesday: [...daySchema],
	//thursday: [...daySchema],
	//friday: [...daySchema],
	//saturday: [...daySchema],
})


export default mongoose.model('Shedule', SheduleSchema);