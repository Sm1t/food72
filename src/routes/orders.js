import testDefaultRoutes from '../resources/testDefaultRoutes';
import Order from '../models/order';
import passport from 'passport';

const params = {
	postMiddlewares: [
		passport.authenticate('jwt', {session: false})
	],
	canRepeated: true
}

const defaultOrders = new testDefaultRoutes(params);
defaultOrders.init(Order, 'order');

export default defaultOrders.router;