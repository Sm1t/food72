import mongoose from 'mongoose';
import _ from 'lodash';
import bcrypt from 'bcryptjs';

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

EmployeeSchema.pre('save', function(next) {
	return bcrypt.genSalt(10)
	.then(salt => {
		bcrypt.hash(this.password, salt)
		.then(hash => {
			this.password = hash;
			next();
		})
	})
	.catch(next)
})

export default mongoose.model('Employee', EmployeeSchema);


