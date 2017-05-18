import testDefaultRoutes from '../resources/testDefaultRoutes';
import Order from '../models/order';
import passport from 'passport';

const defaultOrders = new testDefaultRoutes({
	postMiddlewares: [
		passport.authenticate('jwt', {session: false})
	],
	canRepeated: true,
	populate: 'user dishes.dish'
});

defaultOrders.init(Order, 'order');

export default defaultOrders.router;