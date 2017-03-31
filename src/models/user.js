import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Promise from 'bluebird';
import _ from 'lodash';
mongoose.Promise = Promise;

const UserSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	phone: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	email: {
		type: String
	},
	avatar: {
		type: String,
		default: ''
	}
}, {
	timestamps: true
});


UserSchema.methods.toJSON = function() {
	return _.pick(this, ['_id', 'name', 'phone', 'email', 'avatar']);
}

export default mongoose.model('User', UserSchema);


