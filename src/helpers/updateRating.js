import Dish from '../models/dish';
import Comment from '../models/comment';

export default async (dishId, valuation) => {
	let commentsCount = await Comment.find().count(),
		currentRating = (await Dish.findOne({_id: dishId})).rating;
	return Dish.update({_id: dishId}, {$set: {
		rating: (valuation + currentRating * (commentsCount - 1))/commentsCount
	}})
}
