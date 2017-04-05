import defaultRoutes from '../resources/defaultRoutes';
import Order from '../models/order';

const defaultOrders = new defaultRoutes();
defaultOrders.init(Order, 'likes');

export default defaultOrders.router;