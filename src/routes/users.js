import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import config from '../config/index';
import User from '../models/user';
import Like from '../models/like';
import Comment from '../models/comment';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {

	const data = req.body;

	const exist = await User.findOne({phone: data.phone});
	if (exist) {
		return res.json({success: false, msg: 'User already exist'});
	}

	try {
		const user = new User(data);
		const hash = await User.hashPassword(user.password);
		user.password = hash;
		const phone = user.phone;
		user.save();
		const token = jwt.sign({phone}, config.secret, {
				expiresIn: 604800 // 1 week
			});
		return res.json({user, token: 'JWT ' + token});
	}
	catch(err) {
		return res.status(500).json(err);
	}
})

// Authenticate
router.post('/auth', async (req, res) => {
	const phone = req.body.phone;
	const password = req.body.password;

	const user = await User.findOne({phone: phone});
	if (!user) {
		return res.status(403).json({success: false, msg: 'User not found'});
	}

	console.log(password, user.password);
	
	try {
		const isMatch = await User.comparePassword(password, user.password);
		if (isMatch) {
			const token = jwt.sign({phone}, config.secret, {
				expiresIn: 604800 // 1 week
			});
			res.json({success: true, token: 'JWT ' + token});
		} else {
			return res.status(403).json({success: false, msg: 'Wrong password'});
		}
	} catch(err) {
		throw err;
	}
})

router.get('/profile', passport.authenticate('jwt', {session: false}), async (req, res) => {
	res.json({user: req.user});
})


// Find user by id
router.get('/:userId?/:selection?', async (req, res) => {
	const userId = req.params.userId;
	const selection = req.params.selection;
	const arr = ['likes', 'comments'];
	
	if (!userId && !selection) {
		const users = await User.find();
		return res.json(users);
	}

	const re = new RegExp('(^[0-9a-fA-F]{24}$)');
	if (!userId.match(re)) {
		return res.status(400).json({success: false, msg: 'Incorrect userId'});
	}


	const user = await User.findOne({_id: userId});
	if (userId && !selection) {
		if (!user) {
			return res.status(404).json({succuss:false, msg: 'User not found'});
		}
		return res.json(user);
	} 

	if (arr.indexOf(`${selection}`)!= -1) {
		switch(selection) {
			case 'likes':
				const likes = await Like.find({user: user._id});
				return res.json(likes);
			break;
			case 'comments':
				const comments = await Comment.find({user: user._id});
				return res.json(comments);
			break;
		}
	} else {
		return res.status(400).json({success: false, msg: 'Bad Request'});
	}
})


// Change users fields
router.post('/:userId?', async (req, res) => {
	const userId = req.params.userId;

	const re = new RegExp('(^[0-9a-fA-F]{24}$)');
	if (!userId || !userId.match(re)) {
		return res.status(400).json({success: false, msg: 'Incorrect userId'});
	}

	const user = await User.findOne({_id: userId});
	if(!user) {
		return res.status(404).json({success: false, msg: 'User not found'});
	}

	try {
		const changes = req.body;
		await User.update({_id: userId}, {$set:
			changes
		})
		return res.json(await User.findOne({_id: userId}));
	} catch(err) {
		console.log(err);
		return res.status(500).json({success: false, msg: 'Server Error', Error_name: err.name, Error_msg: err.message});
	}
})

export default router;