const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
import User from '../models/user';
import Employee from '../models/employee';
import config from '../config/index';

export default async function Passport(passport){
	let opts = {};
	opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
	opts.secretOrKey = config.secret;
	passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
		try {
			if (jwt_payload.login) {
				var user = await Employee.findOne({login: jwt_payload.login});
			}
			if (jwt_payload.phone) {
				var user = await User.findOne({phone: jwt_payload.phone});
			}
			
			if (user) {
				return done(null, user);
			} else done(null, false);
		} catch(err) {
			return done(err, false);
		}
	}))
}