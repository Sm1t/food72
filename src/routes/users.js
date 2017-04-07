import passport from 'passport';
import jwt from 'jsonwebtoken';
import config from '../config/index';
import bcrypt from 'bcryptjs';
import User from '../models/user';
import Like from '../models/like';
import Comment from '../models/comment';
import defaultRoutes from '../resources/defaultRoutes';

const defaultUsers = new defaultRoutes();

// Register
defaultUsers.router.post('', async(req, res) => {
	const exist = await User.findOne({phone: req.body.phone});;
	if (exist) return res.status(400).json({success: false, msg: 'User already exist'});

	try {
		const user = new User(req.body),
			  phone = user.phone,
			  salt = await bcrypt.genSalt(10),
		 	  hash = await bcrypt.hash(user.password, salt);
		user.password = hash;
		user.save();
		const token = jwt.sign({phone}, config.secret, {expiresIn: 604800});
		return res.status(201).json(Object.assign({}, user.toJSON(), {token: 'JWT ' + token}));
	} catch(err) {
		console.log(err);
		return res.status(500).json({success: false, msg: err.name});
	}
});

// Authenticate
defaultUsers.router.post('/authenticate', async(req, res) => {
	const phone = req.body.phone,
		  password = req.body.password;

	const user = await User.findOne({phone: phone});
	if (!user) return res.status(404).json({success: false, msg: "User not found"});

	try {
		if (await bcrypt.compare(password, user.password)) {
			const token = jwt.sign({phone}, config.secret, {expiresIn: 604800});
			return res.json(Object.assign({}, user.toJSON(), {token: 'JWT ' + token}));
		} else {
			return res.status(403).json({success: false, msg: 'Wrong password'});
		}
	} catch(err) {
		return res.status(500).json({success: false, msg: err.name});
	}
})

defaultUsers.router.get('/profile', passport.authenticate('jwt', {session: false}), async (req, res) => {
	res.json({user: req.user});
})

defaultUsers.init(User, 'user');

export default defaultUsers.router;

