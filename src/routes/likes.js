import defaultRoutes from '../resources/defaultRoutes';
import Like from '../models/like';

const defaultLikes = new defaultRoutes();
defaultLikes.init(Like, 'likes');

export default defaultLikes.router;