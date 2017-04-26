import testDefaultRoutes from '../resources/testDefaultRoutes';
import Shedule from '../models/shedule';
import checkId from '../middleware/checkId';
import passport from 'passport';


const params = {
	getMiddlewares:[
		/*passport.authenticate('jwt', {session: false}),
		(req, res, next) => {
			if (req.user && req.user.login) {
				return next();
			}
			return res.json({success: false, msg: 'access denied'})
		}*/
	], //middlewares for 'get' request
	postMiddlewares:[], //middlewares for 'post' request
	deleteMiddlewares:[], //middlewares for 'delete' request
	putMiddlewares:[] //middlewares for 'put' request
}

const defaultShedules = new testDefaultRoutes(params);
defaultShedules.init(Shedule, 'shedules');






/*defaultShedules.router.get('', async(req, res, next) => {
	try {

	} catch(err) {
		netx(err);
	}
})

defaultShedules.initPost(Shedule, 'shedules');
defaultShedules.initChange(Shedule, 'shedules');
defaultShedules.initDelete(Shedule, 'shedules');*/

export default defaultShedules.router;