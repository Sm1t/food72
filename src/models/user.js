import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Promise from 'bluebird';
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
		type: String
	}
}, {
	timestamps: true
});


UserSchema.methods.getUserById = async function(userId) {
	return await User.findById({id: userId});
}

UserSchema.statics.hashPassword = async function(password) {
	try	{
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt);
		return hash;
	}

	catch(err) {
		throw err;
	}
}

UserSchema.statics.comparePassword = async function(candidatePassword, hash)  {
	console.log('try compare');
	try {
		const isMatch = await bcrypt.compare(candidatePassword, hash);
		console.log(isMatch);
		return isMatch;
	} catch(err) {
		throw err;
	}
}

export default mongoose.model('User', UserSchema);


