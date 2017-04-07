import mongoose from 'mongoose';

const TraceSchema = mongoose.Schema({
	headers: [
		{
			type: String
		}
	]
})

export default mongoose.model('Trace', TraceSchema);