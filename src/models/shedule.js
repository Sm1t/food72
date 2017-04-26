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
}, {
	_id: false
})



const SheduleSchema = mongoose.Schema({
	monday: daySchema,
	tuesday: daySchema,
	wednesday: daySchema,
	thursday: daySchema,
	friday: daySchema,
	saturday: daySchema,
}, {
	timestamps: true
})


export default mongoose.model('Shedule', SheduleSchema);