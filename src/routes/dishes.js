import Dish from '../models/dish';
import testDefaultRoutes from '../resources/testDefaultRoutes';
import ifModifiedSince from '../resources/ifModifiedSince';

const defaultDishes = new testDefaultRoutes();

defaultDishes.init(Dish, 'dish');

export default defaultDishes.router;