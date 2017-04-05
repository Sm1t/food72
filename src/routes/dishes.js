import Dish from '../models/dish';
import defaultRoutes from '../resources/defaultRoutes';

const defaultDishes = new defaultRoutes();

defaultDishes.router.get('', async (req, res) => {
	const location = req.query.location;
	if (!location) return res.json(await Dish.find());
	return res.json(await Dish.find({locationId: location}));
})

defaultDishes.init(Dish, 'dishes');

export default defaultDishes.router;