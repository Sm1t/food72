import mongoose from 'mongoose';

const TraceSchema = mongoose.Schema({
	headers: {}
})

export default mongoose.model('Trace', TraceSchema);