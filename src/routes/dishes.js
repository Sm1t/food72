import Dish from '../models/dish';
import defaultRoutes from '../resources/defaultRoutes';

const defaultDishes = new defaultRoutes();

/*defaultDishes.router.get('', async (req, res, next) => {
	const location = req.query.location;
	if (location) {
		return res.json(await Dish.find({ "locations.locationId": location }));
	} else next();
})*/

defaultDishes.init(Dish, 'dishes');

export default defaultDishes.router;