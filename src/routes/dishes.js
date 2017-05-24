import Dish from '../models/dish';
import Comment from '../models/comment';
import testDefaultRoutes from '../resources/testDefaultRoutes';
import ifModifiedSince from '../resources/ifModifiedSince';

const defaultDishes = new testDefaultRoutes();

defaultDishes.router.get('/:id/comments', async(req, res, next) => {
	try {
		const comments = await Comment.find({dish: req.params.id}).populate('user');
		return res.json(comments);
	} catch(err) {
		next(err);
	}
})

defaultDishes.init(Dish, 'dish');

export default defaultDishes.router;