import fs from 'fs';
import path from 'path';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import config from '../config/index';
import bcrypt from 'bcryptjs';
import User from '../models/user';
import Like from '../models/like';
import Comment from '../models/comment';
import testDefaultRoutes from '../resources/testDefaultRoutes';
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

const defaultUsers = new testDefaultRoutes();

// Register
defaultUsers.router.post('', async(req, res) => {
	const exist = await User.findOne({phone: req.body.phone});
	if (exist) return res.status(400).json({success: false, msg: 'User already exist'});

	try {
		const user = new User(req.body),
			  phone = user.phone;
		user.save();
		const token = jwt.sign({phone}, config.secret, {expiresIn: 604800});
		return res.status(201).json(Object.assign({}, user.toJSON(), {token: 'JWT ' + token}));
	} catch(err) {
		console.log(err);
		return res.status(500).json({success: false, msg: err.name});
	}
});

// login
defaultUsers.router.post('/login', async(req, res) => {
	const phone = req.body.phone,
		  password = req.body.password;

	try {
		const user = await User.findOne({phone: phone});
		if (!user) return res.status(404).json({success: false, msg: "User not found"});

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

defaultUsers.router.post('/avatar', multipartMiddleware, passport.authenticate('jwt', {session: false}), async(req, res) => {
	const img = req.files.null;

	fs.readFile(img.path, (err, data) => {
		const way = path.resolve(__dirname, '../src/uploads/images') + '/' + req.user._id + '.png';
		fs.writeFile(way, data, err => {
			if (err) res.send(err);
			res.send('uploaded!');
		})
	})
})

defaultUsers.router.get('/avatar', passport.authenticate('jwt', {session: false}), async(req, res) => {
	try {
		res.sendFile(path.resolve(__dirname, '../src/uploads/images') + '/' + req.user._id + '.png');
	} catch(err) {
		res.send(err);
	}
})

defaultUsers.router.post('/profile', passport.authenticate('jwt', {session: false}), async (req, res) => {
	res.json(['/dishes', 'toppings', '/locations'].indexOf(req.path));
})

defaultUsers.init(User, 'user');

export default defaultUsers.router;

