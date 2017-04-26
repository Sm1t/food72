import testDefaultRoutes from '../resources/testDefaultRoutes';
import Topping from '../models/topping';

const defaultToppings = new testDefaultRoutes();
defaultToppings.init(Topping, 'topping');

export default defaultToppings.router;