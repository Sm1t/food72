import defaultRoutes from '../resources/defaultRoutes';
import Order from '../models/order';

const defaultOrders = new defaultRoutes();
defaultOrders.init(Order, 'orders');

export default defaultOrders.router;