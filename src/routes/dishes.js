import Dish from '../models/dish';
import defaultRoutes from '../resources/defaultRoutes';
import ifModifiedSince from '../resources/ifModifiedSince';

const defaultDishes = new defaultRoutes();

defaultDishes.router.get('', async (req, res, next) => {
	const id = req.params.id;
	const select = req.params.select;

	if (!id && !select) {
		let modifiedSince = req.headers['if-modified-since'];
		if (modifiedSince) {
			try {
				const changes = await ifModifiedSince(Dish, modifiedSince);
				if (changes) {
					res.set('Last-Modified', changes.lastModified);
					return res.json(changes.news);
				} else {
					return res.status(304).send();
				}
			} catch(err) {
				next(err);	
			}	
		} else {
			return res.json(await Dish.find());
		}
	}
})

defaultDishes.initPost(Dish, 'dishes');
defaultDishes.initChange(Dish, 'dishes');
defaultDishes.initDelete(Dish, 'dishes');

export default defaultDishes.router;