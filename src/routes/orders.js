import testDefaultRoutes from '../resources/testDefaultRoutes';
import Order from '../models/order';

const defaultOrders = new testDefaultRoutes();
defaultOrders.init(Order, 'order');

export default defaultOrders.router;