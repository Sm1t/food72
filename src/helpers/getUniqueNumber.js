import Order from '../models/order';

export default async () => {
	const arr = [...Array(10).keys()].splice(1);
	const orders = await Order.find();
	const usedNumbers = [];
	orders.map(order => {
		usedNumbers.push(order.number);
	})
	const unique = arr.filter((value) => {
		return usedNumbers.indexOf(value) == -1;
	});
	return unique[0];
}