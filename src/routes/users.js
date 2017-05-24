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
defaultUsers.router.post('', async(req, res, next) => {
	const exist = await User.findOne({phone: req.body.phone});
	if (exist) return res.status(400).json({success: false, msg: 'User already exist'});

	try {
		const user = new User(req.body),
			  phone = user.phone;
		user.save();
		const token = jwt.sign({phone}, config.secret, {expiresIn: 604800});
		return res.status(201).json(Object.assign({}, user.toJSON(), {token: 'JWT ' + token}));
	} catch(err) {
		next(err);
	}
});

// login
defaultUsers.router.post('/login', async(req, res, next) => {
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
		next(err);
	}
})

defaultUsers.router.post('/avatars', multipartMiddleware, passport.authenticate('jwt', {session: false}), async(req, res, next) => {
	try {
		const img = req.files.avatar;
		fs.writeFile(__dirname + '/debug.txt', JSON.stringify(req.files), err => {
			if (err) throw err;
		})

		let oldImage = (await User.findById(req.user._id)).avatar;
		if (oldImage != '') {
			oldImage = path.resolve(__dirname, '../uploads/avatars') + '/' + oldImage.split('/avatars/')[1];
			fs.unlink(oldImage, err => {
				if (err) throw err;
			})
		}

		fs.readFile(img.path, (err, data) => {
			if (err) next(err);
			const way = path.resolve(__dirname, '../uploads/avatars') + '/' + img.originalFilename;
			fs.writeFile(way, data, async(err) => {
				if (err) next(err);
				const link = 'http://arusremservis.ru/users/avatars/' + img.originalFilename;
				await User.findOneAndUpdate({_id: req.user._id}, {$set: {
					avatar: link
				}});
				res.json({success: true, link: link});
			})
		})
	} catch(err) {
		next(err);
	}
})

defaultUsers.router.get('/avatars/:img', async(req, res) => {
	try {
		res.sendFile(path.resolve(__dirname, '../uploads/avatars') + '/' + req.params.img);
	} catch(err) {
		res.send(err);
	}
})

defaultUsers.router.put('', passport.authenticate('jwt', {session: false}), async(req, res, next) => {
	try {
		const user = await User.findOneAndUpdate({_id: req.user._id}, {$set:
			req.body,
			returnNewDocument : true
		})
		return res.json(user);
	} catch(err) {
		next(err);
	}
})

defaultUsers.router.delete('', passport.authenticate('jwt', {session: false}), async(req, res, next) => {
	try {
		await User.findOneAndRemove({_id: req.user._id})
		return res.json({success: true, msg: 'User updated'});
	} catch(err) {
		next(err);
	}
})

defaultUsers.router.post('/profile', passport.authenticate('jwt', {session: false}), async (req, res) => {
	res.json(['/dishes', 'toppings', '/locations'].indexOf(req.path));
})

defaultUsers.initGet(User, 'user');

export default defaultUsers.router;