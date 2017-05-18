import testDefaultRoutes from '../resources/testDefaultRoutes';
import Comment from '../models/comment';

const defaultComments = new testDefaultRoutes({canRepeated: true});
defaultComments.init(Comment, 'comments');

export default defaultComments.router;