import passport from 'passport';
import testdefaultRoutes from '../resources/testdefaultRoutes';
import Employee from '../models/employee';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/index';

const params = {
	viewerMiddlewares:[],
	modifierMiddlewares:[]
}

const defaultEmployees = new testdefaultRoutes(params);

// Register
defaultEmployees.router.post('', async(req, res) => {
	const exist = await Employee.findOne({login: req.body.login});;
	if (exist) return res.status(400).json({success: false, msg: 'Employee already exist'});

	try {
		const employee = new Employee(req.body),
			  login = employee.login,
			  salt = await bcrypt.genSalt(10),
		 	  hash = await bcrypt.hash(employee.password, salt);
		employee.password = hash;
		employee.save();
		const token = jwt.sign({login}, config.secret, {expiresIn: 604800});
		return res.status(201).json(Object.assign({}, employee.toJSON(), {token: 'JWT ' + token}));
	} catch(err) {
		console.log(err);
		return res.status(500).json({success: false, msg: err.name});
	}
});

// Authenticate
defaultEmployees.router.post('/login', async(req, res) => {
	const login = req.body.login,
		  password = req.body.password;

	const employee = await Employee.findOne({login: login});
	if (!employee) return res.status(404).json({success: false, msg: "Employee not found"});

	try {
		if (await bcrypt.compare(password, employee.password)) {
			const token = jwt.sign({login}, config.secret, {expiresIn: 604800});
			return res.json(Object.assign({}, employee.toJSON(), {token: 'JWT ' + token}));
		} else {
			return res.status(403).json({success: false, msg: 'Wrong password'});
		}
	} catch(err) {
		return res.status(500).json({success: false, msg: err.name});
	}
})

defaultEmployees.router.post('/profile', passport.authenticate('jwt', {session: false}), async (req, res) => {
	res.json(req.user);
})


defaultEmployees.initGet(Employee, 'employees');

export default defaultEmployees.router;