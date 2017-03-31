import defaultRoutes from '../resources/defaultRoutes';
import Topping from '../models/topping';

const defaultToppings = new defaultRoutes();
defaultToppings.init(Topping, 'toppings');

export default defaultToppings.router;