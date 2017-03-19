import express from 'express';
import config from '../config/index';
import Dish from '../models/dish';
import Like from '../models/like';
import Comment from '../models/comment';
import Topping from '../models/topping';
import Location from '../models/location';
const router = express.Router();
import SaveData from '../SaveData';

// Show likes List
router.get('/likes', async (req, res) => {
	const likes = await Like.find();
	return res.json(likes);
})
// Add Like
router.post('/likes', async (req, res) => {
	try {
		const data = req.body;
		(new Like(data)).save();
		return res.json('okay');
	} catch(err) {
		return res.status(500).json({success: false, msg: 'Server error:'});
	}

})


// Show comments List
router.get('/comments', async (req, res) => {
	const comments = await Comment.find();
	return res.json(comments);
})
// Add Comment
router.post('/comments', async (req, res) => {
	try {
		const data = req.body;
		(new Comment(data)).save();
		return res.json('ok');
	} catch(err) {
		return res.status(500).json({success: false, msg: 'Server error:'});
	}

})


// Show toppings List
router.get('/toppings', async (req, res) => {
	const toppings = await Topping.find();
	return res.json(toppings);
})
// Add Topping
router.post('/toppings', async (req, res) => {
	try {
		const data = req.body;
		(new Topping(data)).save();
		return res.json('ok');
	} catch(err) {
		return res.status(500).json({success: false, msg: 'Server error:'});
	}

})


// Show locations List
router.get('/locations', async (req, res) => {
	const locations = await Location.find();
	return res.json(locations);
})
// Add Location
router.post('/locations', async (req, res) => {
	try {
		const data = req.body;
		(new Location(data)).save();
		return res.json('ok');
	} catch(err) {
		return res.status(500).json({success: false, msg: 'Server error:'});
	}
	
})

// Default
router.get('/:dishId?/:selection?', async (req, res) => {
	const dishId = req.params.dishId;
	const selection = req.params.selection;
	const arr = ['likes', 'comments', 'toppings', 'locations', 'composition'];
	
	if (!dishId && !selection) {
		const dishes = await Dish.find();
		return res.json(dishes);
	}

	const re = new RegExp('(^[0-9a-fA-F]{24}$)');
	if (!dishId.match(re)) {
		return res.status(400).json({success: false, msg: 'Incorrect userId'});
	}

	const dish = await Dish.findOne({_id: dishId});
	if (dishId && !selection) {
		if (!dish) {
			return res.status(404).json({succuss:false, msg: 'Dish not found'});
		}
		return res.json(dish);
	} 

	if (arr.indexOf(`${selection}`)!= -1) {
		switch(selection) {
			case 'likes':
				const likes = await Like.find({dish: dish._id});
				return res.json(likes);
			break;
			case 'comments':
				const comments = await Comment.find({dish: dish._id});
				return res.json(comments);
			break;
			case 'toppings':
				return res.json(dish.toppings);
			break;
			case 'locations':
				return res.json(dish.locations);
			break;
			case 'composition':
				return res.json(dish.composition);
			break;
		}

	} else {
		return res.status(400).json({success: false, msg: 'Bad Request'});
	}
	

	

	

	 /*else {
		const dishes = await Dish.findOne({name: dishId});
		return res.send(dishes[`${selection}`]);
	}*/
	
})



// Add Product
router.post('', async (req, res) => {
	
	const data = req.body;

	// if dish.name will primary
	/*const dishName = await Dish.findOne({name: data.dish.name});
	if (dishName) return res.json({success: false, msg: 'Dish already exist'});*/

	// can use addDish function:
	/*try {
		const result = await addDish(data);
		return res.json(result);
	} catch(err) {
		return res.status(500).json(err);
	}*/


	try {
		const dish = new Dish(data.dish);
		await dish.save();
		return res.json(dish);
	} catch(err) {
		throw err;
	}
})

export default router;

	/*const data = req.body;
	let newComment = new Comment(data);

	try {
		const comment = await newComment.save();
		return res.json(comment);
	} catch(err) {
		res.status(500).json('err');
	}*/