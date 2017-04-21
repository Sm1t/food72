import defaultRoutes from '../resources/defaultRoutes';
import Like from '../models/like';
import Dish from '../models/dish';

const defaultLikes = new defaultRoutes();

defaultLikes.router.post('', async(req, res) => {
	try {
		const elem = new Like(req.body);
		await elem.save();
		const test = await Dish.find({_id: elem.dishId});
		console.log(test);
		return res.status(201).json(elem);
	} catch(err) {
		console.log(err);
		return res.status(500).json({success: false, msg: err.name});
	}
})

defaultLikes.init(Like, 'likes');

export default defaultLikes.router;
