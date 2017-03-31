import defaultRoutes from '../resources/defaultRoutes';
import Comment from '../models/comment';

const defaultComments = new defaultRoutes();
defaultComments.init(Comment, 'comments');

export default defaultComments.router;