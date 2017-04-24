import testDefaultRoutes from '../resources/testDefaultRoutes';
import Shedule from '../models/shedule';
import checkId from '../middleware/checkId';
import passport from 'passport';


const params = {
	viewerMiddlewares: [
		checkId
	],
	modifierMiddlewares: [
		//passport.authenticate('jwt', {session: false})
	]
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