import config from '../config/index';
import Dish from '../models/dish';
import Like from '../models/like';
import Comment from '../models/comment';
import Topping from '../models/topping';
import Location from '../models/location';
import defaultRoutes from '../resources/defaultRoutes';

const defaultDishes = new defaultRoutes();

/*defaultDishes.router.get('', async (req, res) => {
	if (!id && !select) return res.json(await model.find());
})*/

defaultDishes.init(Dish, 'dishes');

export default defaultDishes.router;