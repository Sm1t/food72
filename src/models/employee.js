import mongoose from 'mongoose';
import _ from 'lodash';

const EmployeeSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	surname: {
		type: String,
		required: true
	},
	position: {
		type: String,
		required: true
	},
	login: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	role: {
		type: String,
		required: true,
		default: 'employee'
	}
}, {
	timestamps: true
});


EmployeeSchema.methods.toJSON = function() {
	return _.pick(this, ['_id', 'name', 'surname', 'position']);
}

export default mongoose.model('Employee', EmployeeSchema);


