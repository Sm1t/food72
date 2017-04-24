import defaultRoutes from '../resources/defaultRoutes';
import Like from '../models/like';
import Dish from '../models/dish';
import checkId from '../middleware/checkId';
import passport from 'passport';

const defaultLikes = new defaultRoutes();

defaultLikes.router.post('', passport.authenticate('jwt', {session: false}), async(req, res, next) => {
	try {
		const exist = await Like.findOne({dishId: req.body.dishId, userId: req.user._id});
		if (exist) {
			await Dish.update({_id: exist.dishId}, {$inc:
				{
					likes: -1
				}
			});
			await exist.remove();
			return res.json({success: true, msg: 'мнi тожi похуi'});
		}
		const newLike = new Like(Object.assign({}, req.body, {userId: req.user._id}));
		await newLike.save();
		await Dish.update({_id: newLike.dishId}, {$inc:
			{
				likes: 1
			}
		});
		return res.status(201).json(newLike);
	} catch(err) {
		next(err);
	}
})

defaultLikes.initGet(Like, 'likes');

export default defaultLikes.router;
