import testDefaultRoutes from '../resources/testDefaultRoutes';
import Like from '../models/like';
import Dish from '../models/dish';
import checkId from '../middleware/checkId';
import passport from 'passport';

const defaultLikes = new testDefaultRoutes();

defaultLikes.router.post('', passport.authenticate('jwt', {session: false}), async(req, res, next) => {
	try {
		const exist = await Like.findOne({dishId: req.body.dishId, userId: req.user._id});
		if (exist) {
			await exist.remove();
			(await Dish.findOne({_id: req.body.dishId})).updateLikesCount();
			return res.json({success: true, msg: 'Like deleted'});
		}

		const newLike = new Like(Object.assign({}, req.body, {userId: req.user._id}));
		await newLike.save();
		(await Dish.findOne({_id: req.body.dishId})).updateLikesCount();
		return res.status(201).json(newLike);

	} catch(err) {
		next(err);
	}
})

defaultLikes.initGet(Like, 'like');

export default defaultLikes.router;
