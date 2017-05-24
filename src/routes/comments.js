import testDefaultRoutes from '../resources/testDefaultRoutes';
import Comment from '../models/comment';
import passport from 'passport';

const defaultComments = new testDefaultRoutes({
	postMiddlewares: [
		passport.authenticate('jwt', {session: false})
	],
	canRepeated: true,
	populate: 'user'
});
defaultComments.init(Comment, 'comments');

export default defaultComments.router;