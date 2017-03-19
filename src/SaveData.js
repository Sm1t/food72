import Dish from './models/dish';

export default async function test(elem) {

	try {
		await elem.save();
		return {
			elem
		}
	} catch(err) {
		throw err;
	}
}


/*
			const promises = data.dish.map((elem) => {
				console.log('2');
				const dishData = Object.assign({}, elem);
				return (new Dish(dishData)).save();
			})
		return {
			dish: await Promise.all(promises)
		}
*/