'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var express = _interopDefault(require('express'));
var cors = _interopDefault(require('cors'));
var mongoose = require('mongoose');
var mongoose__default = _interopDefault(mongoose);
var Promise = _interopDefault(require('bluebird'));
var path = _interopDefault(require('path'));
var passport = _interopDefault(require('passport'));
var _regeneratorRuntime = _interopDefault(require('babel-runtime/regenerator'));
var _asyncToGenerator = _interopDefault(require('babel-runtime/helpers/asyncToGenerator'));
var bcrypt = _interopDefault(require('bcryptjs'));
var _ = _interopDefault(require('lodash'));
var _Object$assign = _interopDefault(require('babel-runtime/core-js/object/assign'));
var jwt = _interopDefault(require('jsonwebtoken'));
var _JSON$stringify = _interopDefault(require('babel-runtime/core-js/json/stringify'));
var _classCallCheck = _interopDefault(require('babel-runtime/helpers/classCallCheck'));
var _createClass = _interopDefault(require('babel-runtime/helpers/createClass'));

var config = {
	database: 'mongodb://sm1t:34ezezin@ds145299.mlab.com:45299/food72',
	secret: 'yoursecret'
};

mongoose__default.Promise = Promise;

var UserSchema = mongoose__default.Schema({
	name: {
		type: String,
		required: true
	},
	phone: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	email: {
		type: String
	},
	avatar: {
		type: String,
		default: ''
	}
}, {
	timestamps: true
});

UserSchema.methods.toJSON = function () {
	return _.pick(this, ['_id', 'name', 'phone', 'email', 'avatar']);
};

var User = mongoose__default.model('User', UserSchema);

var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var Passport = (function () {
	var _ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee2(passport$$1) {
		var _this = this;

		var opts;
		return _regeneratorRuntime.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						opts = {};

						opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
						opts.secretOrKey = config.secret;
						passport$$1.use(new JwtStrategy(opts, function () {
							var _ref2 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee(jwt_payload, done) {
								var user;
								return _regeneratorRuntime.wrap(function _callee$(_context) {
									while (1) {
										switch (_context.prev = _context.next) {
											case 0:
												_context.prev = 0;

												console.log(jwt_payload);
												_context.next = 4;
												return User.findOne({ phone: jwt_payload.phone });

											case 4:
												user = _context.sent;

												console.log(user);

												if (!user) {
													_context.next = 10;
													break;
												}

												return _context.abrupt('return', done(null, user));

											case 10:
												done(null, false);

											case 11:
												_context.next = 16;
												break;

											case 13:
												_context.prev = 13;
												_context.t0 = _context['catch'](0);
												return _context.abrupt('return', done(_context.t0, false));

											case 16:
											case 'end':
												return _context.stop();
										}
									}
								}, _callee, _this, [[0, 13]]);
							}));

							return function (_x2, _x3) {
								return _ref2.apply(this, arguments);
							};
						}()));

					case 4:
					case 'end':
						return _context2.stop();
				}
			}
		}, _callee2, this);
	}));

	function Passport(_x) {
		return _ref.apply(this, arguments);
	}

	return Passport;
})();

var Schema$1 = mongoose__default.Schema;


var LikeSchema = mongoose__default.Schema({
	dish: {
		type: Schema$1.Types.ObjectId,
		ref: 'Dish',
		required: true
	},
	user: {
		type: Schema$1.Types.ObjectId,
		ref: 'User',
		required: true
	}
});

var Like = mongoose__default.model('Like', LikeSchema);

var CommentSchema = mongoose__default.Schema({
	dish: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Dish',
		required: true
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	text: {
		type: String,
		required: true
	},
	rating: {
		type: Number,
		required: true
	}
}, {
	timestamps: true
});

var Comment = mongoose__default.model('Comment', CommentSchema);

var TraceSchema = mongoose__default.Schema({
	headers: [{
		type: String
	}]
});

var Trace = mongoose__default.model('Trace', TraceSchema);

var defaultRoutes = function () {
	function defaultRoutes() {
		_classCallCheck(this, defaultRoutes);

		this.router = express.Router();
	}

	_createClass(defaultRoutes, [{
		key: 'init',
		value: function init(model, modelName) {
			var _this = this;

			this.router.get('/:id?/:select?', function () {
				var _ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee(req, res) {
					var id, select, modifiedSince, news, lastModified, re, elem, _elem;

					return _regeneratorRuntime.wrap(function _callee$(_context) {
						while (1) {
							switch (_context.prev = _context.next) {
								case 0:
									id = req.params.id;
									select = req.params.select;

									if (!(!id && !select)) {
										_context.next = 31;
										break;
									}

									modifiedSince = req.headers['if-modified-since'];

									if (!modifiedSince) {
										_context.next = 26;
										break;
									}

									_context.next = 7;
									return new Trace({ headers: modifiedSince }).save();

								case 7:
									_context.prev = 7;
									_context.next = 10;
									return model.find({ "updatedAt": { $gt: modifiedSince } });

								case 10:
									news = _context.sent;

									if (!news[0]) {
										_context.next = 17;
										break;
									}

									lastModified = news.reduce(function (prev, candidate) {
										return prev.updatedAt > candidate.updatedAt ? prev : candidate;
									});

									res.header({ 'Last-Modified': _JSON$stringify(lastModified.updatedAt) });
									return _context.abrupt('return', res.json(news));

								case 17:
									return _context.abrupt('return', res.status(304).send());

								case 18:
									_context.next = 24;
									break;

								case 20:
									_context.prev = 20;
									_context.t0 = _context['catch'](7);

									console.log(_context.t0);
									return _context.abrupt('return', res.status(500).json({ success: false, msg: _context.t0.name }));

								case 24:
									_context.next = 31;
									break;

								case 26:
									_context.t1 = res;
									_context.next = 29;
									return model.find();

								case 29:
									_context.t2 = _context.sent;
									return _context.abrupt('return', _context.t1.json.call(_context.t1, _context.t2));

								case 31:
									re = new RegExp('(^[0-9a-fA-F]{24}$)');

									if (id.match(re)) {
										_context.next = 34;
										break;
									}

									return _context.abrupt('return', res.status(400).json({ success: false, msg: 'Incorrect ' + modelName + ' id' }));

								case 34:
									if (!(id && !select)) {
										_context.next = 47;
										break;
									}

									_context.prev = 35;
									_context.next = 38;
									return model.findById(id);

								case 38:
									elem = _context.sent;

									if (elem) {
										_context.next = 41;
										break;
									}

									return _context.abrupt('return', res.status(404).json({ success: false, msg: modelName + ' not found' }));

								case 41:
									return _context.abrupt('return', res.json(elem));

								case 44:
									_context.prev = 44;
									_context.t3 = _context['catch'](35);
									return _context.abrupt('return', res.status(500).json({ success: false, msg: _context.t3.name }));

								case 47:
									_context.prev = 47;
									_context.next = 50;
									return model.findById(id);

								case 50:
									_elem = _context.sent;

									if (_elem['' + select]) {
										_context.next = 53;
										break;
									}

									return _context.abrupt('return', res.json({ success: false, msg: 'Cannot select ' + select }));

								case 53:
									return _context.abrupt('return', res.json(_elem['' + select]));

								case 56:
									_context.prev = 56;
									_context.t4 = _context['catch'](47);
									return _context.abrupt('return', res.status(500).json({ success: false, msg: _context.t4.name }));

								case 59:
								case 'end':
									return _context.stop();
							}
						}
					}, _callee, _this, [[7, 20], [35, 44], [47, 56]]);
				}));

				return function (_x, _x2) {
					return _ref.apply(this, arguments);
				};
			}());

			this.router.post('/:id?', function () {
				var _ref2 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee2(req, res) {
					var id, elem, re, _elem2;

					return _regeneratorRuntime.wrap(function _callee2$(_context2) {
						while (1) {
							switch (_context2.prev = _context2.next) {
								case 0:
									id = req.params.id;

									if (id) {
										_context2.next = 13;
										break;
									}

									_context2.prev = 2;
									elem = new model(req.body);
									_context2.next = 6;
									return elem.save();

								case 6:
									return _context2.abrupt('return', res.status(201).json(elem));

								case 9:
									_context2.prev = 9;
									_context2.t0 = _context2['catch'](2);

									console.log(_context2.t0);
									return _context2.abrupt('return', res.status(500).json({ success: false, msg: _context2.t0.name }));

								case 13:
									re = new RegExp('(^[0-9a-fA-F]{24}$)');

									if (id.match(re)) {
										_context2.next = 16;
										break;
									}

									return _context2.abrupt('return', res.status(400).json({ success: false, msg: 'Incorrect ' + modelName + ' id' }));

								case 16:
									_context2.prev = 16;
									_context2.next = 19;
									return model.findById(id);

								case 19:
									_elem2 = _context2.sent;

									if (_elem2) {
										_context2.next = 22;
										break;
									}

									return _context2.abrupt('return', res.status(404).json({ success: false, msg: modelName + ' not found' }));

								case 22:
									if (!req.body.delete) {
										_context2.next = 26;
										break;
									}

									_context2.next = 25;
									return _elem2.remove();

								case 25:
									return _context2.abrupt('return', res.json({ success: true, msg: modelName + ' deleted' }));

								case 26:
									_context2.next = 28;
									return model.update({ _id: id }, { $set: req.body
									});

								case 28:
									return _context2.abrupt('return', res.json({ success: true, msg: modelName + ' updated' }));

								case 31:
									_context2.prev = 31;
									_context2.t1 = _context2['catch'](16);
									return _context2.abrupt('return', res.status(500).json({ success: false, msg: _context2.t1.name }));

								case 34:
								case 'end':
									return _context2.stop();
							}
						}
					}, _callee2, _this, [[2, 9], [16, 31]]);
				}));

				return function (_x3, _x4) {
					return _ref2.apply(this, arguments);
				};
			}());
		}
	}]);

	return defaultRoutes;
}();

var _this = undefined;

var defaultUsers = new defaultRoutes();

// Register
defaultUsers.router.post('', function () {
	var _ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee(req, res) {
		var exist, user, phone, salt, hash, token;
		return _regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						_context.next = 2;
						return User.findOne({ phone: req.body.phone });

					case 2:
						exist = _context.sent;
						;

						if (!exist) {
							_context.next = 6;
							break;
						}

						return _context.abrupt('return', res.status(400).json({ success: false, msg: 'User already exist' }));

					case 6:
						_context.prev = 6;
						user = new User(req.body);
						phone = user.phone;
						_context.next = 11;
						return bcrypt.genSalt(10);

					case 11:
						salt = _context.sent;
						_context.next = 14;
						return bcrypt.hash(user.password, salt);

					case 14:
						hash = _context.sent;

						user.password = hash;
						user.save();
						token = jwt.sign({ phone: phone }, config.secret, { expiresIn: 604800 });
						return _context.abrupt('return', res.status(201).json(_Object$assign({}, user.toJSON(), { token: 'JWT ' + token })));

					case 21:
						_context.prev = 21;
						_context.t0 = _context['catch'](6);

						console.log(_context.t0);
						return _context.abrupt('return', res.status(500).json({ success: false, msg: _context.t0.name }));

					case 25:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, _this, [[6, 21]]);
	}));

	return function (_x, _x2) {
		return _ref.apply(this, arguments);
	};
}());

// Authenticate
defaultUsers.router.post('/authenticate', function () {
	var _ref2 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee2(req, res) {
		var phone, password, user, token;
		return _regeneratorRuntime.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						phone = req.body.phone, password = req.body.password;
						_context2.next = 3;
						return User.findOne({ phone: phone });

					case 3:
						user = _context2.sent;

						if (user) {
							_context2.next = 6;
							break;
						}

						return _context2.abrupt('return', res.status(404).json({ success: false, msg: "User not found" }));

					case 6:
						_context2.prev = 6;
						_context2.next = 9;
						return bcrypt.compare(password, user.password);

					case 9:
						if (!_context2.sent) {
							_context2.next = 14;
							break;
						}

						token = jwt.sign({ phone: phone }, config.secret, { expiresIn: 604800 });
						return _context2.abrupt('return', res.json(_Object$assign({}, user.toJSON(), { token: 'JWT ' + token })));

					case 14:
						return _context2.abrupt('return', res.status(403).json({ success: false, msg: 'Wrong password' }));

					case 15:
						_context2.next = 20;
						break;

					case 17:
						_context2.prev = 17;
						_context2.t0 = _context2['catch'](6);
						return _context2.abrupt('return', res.status(500).json({ success: false, msg: _context2.t0.name }));

					case 20:
					case 'end':
						return _context2.stop();
				}
			}
		}, _callee2, _this, [[6, 17]]);
	}));

	return function (_x3, _x4) {
		return _ref2.apply(this, arguments);
	};
}());

defaultUsers.router.get('/profile', passport.authenticate('jwt', { session: false }), function () {
	var _ref3 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee3(req, res) {
		return _regeneratorRuntime.wrap(function _callee3$(_context3) {
			while (1) {
				switch (_context3.prev = _context3.next) {
					case 0:
						res.json({ user: req.user });

					case 1:
					case 'end':
						return _context3.stop();
				}
			}
		}, _callee3, _this);
	}));

	return function (_x5, _x6) {
		return _ref3.apply(this, arguments);
	};
}());

defaultUsers.init(User, 'user');

var users = defaultUsers.router;

// Product Schema
var DishSchema = mongoose__default.Schema({
	name: {
		type: String,
		required: true
	},
	category: {
		type: String
	},
	locations: [{
		locationId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Location',
			required: true
		}
	}],
	toppings: [{
		toppingId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Topping',
			required: true
		}
	}],
	dishPicture: {
		type: String
	},
	callories: {
		type: Number,
		required: true
	},
	description: {
		type: String
	},
	composition: [{
		name: {
			type: String,
			required: true
		},
		quantity: {
			type: String,
			required: true
		}
	}],
	weight: {
		type: Number,
		required: true
	},
	conteiner: {
		type: {
			type: String,
			required: true
		},
		size: {
			type: Number,
			required: true
		},
		price: {
			type: Number,
			required: true
		}
	},
	proteins: {
		type: Number,
		required: true
	},
	carbohydrates: {
		type: Number,
		required: true
	},
	fats: {
		type: Number,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	rating: {
		type: Number,
		default: 5
	},
	active: {
		type: Boolean,
		default: true,
		required: true
	}
}, {
	timestamps: true
});

/*DishSchema.methods.toJSON = function() {
	
}*/

var Dish = mongoose__default.model('Dish', DishSchema);

var _this$1 = undefined;

var defaultDishes = new defaultRoutes();

defaultDishes.router.get('', function () {
	var _ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee(req, res, next) {
		var location;
		return _regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						location = req.query.location;

						if (!location) {
							_context.next = 9;
							break;
						}

						_context.t0 = res;
						_context.next = 5;
						return Dish.find({ "locations.locationId": location });

					case 5:
						_context.t1 = _context.sent;
						return _context.abrupt('return', _context.t0.json.call(_context.t0, _context.t1));

					case 9:
						next();

					case 10:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, _this$1);
	}));

	return function (_x, _x2, _x3) {
		return _ref.apply(this, arguments);
	};
}());

defaultDishes.init(Dish, 'dishes');

var dishes = defaultDishes.router;

var LocationSchema = mongoose__default.Schema({
	name: {
		type: String,
		required: true
	},
	number: {
		type: Number,
		required: true
	}
});

var Location = mongoose__default.model('Location', LocationSchema);

var defaultLocations = new defaultRoutes();
defaultLocations.init(Location, 'locations');

var locations = defaultLocations.router;

var defaultLikes = new defaultRoutes();
defaultLikes.init(Like, 'likes');

var likes = defaultLikes.router;

var defaultComments = new defaultRoutes();
defaultComments.init(Comment, 'comments');

var comments = defaultComments.router;

var ToppingSchema = mongoose__default.Schema({
	name: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	weight: {
		type: Number,
		required: true
	}
});

var Topping = mongoose__default.model('Topping', ToppingSchema);

var defaultToppings = new defaultRoutes();
defaultToppings.init(Topping, 'toppings');

var toppings = defaultToppings.router;

var Schema$2 = mongoose__default.Schema;


var OrderSchema = mongoose__default.Schema({
	dishes: [{
		dishId: {
			type: Schema$2.Types.ObjectId,
			ref: 'Dish',
			required: true
		},
		quantity: {
			type: Number,
			required: true,
			default: 1
		}
	}],
	payStatus: {
		type: Boolean,
		required: true,
		default: false
	},
	completed: {
		type: Boolean,
		required: true,
		default: false
	},
	status: {
		type: String,
		required: true,
		default: 'Обратывается'
	},
	totalPrice: {
		type: Number,
		required: true
	},
	time: {
		type: String,
		required: true
	}
}, {
	timestamps: true
});

var Order = mongoose__default.model('Order', OrderSchema);

var defaultOrders = new defaultRoutes();
defaultOrders.init(Order, 'likes');

var orders = defaultOrders.router;

var app = express();
var bodyParser = require('body-parser');
Passport(passport);

app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
var port = 3000;

mongoose__default.Promise = Promise;
// Connect to Database
mongoose__default.connect(config.database);
// On connection
mongoose__default.connection.on('connected', function () {
	console.log('connected to database ' + config.database);
});
// On Error
mongoose__default.connection.on('error', function (err) {
	console.log('database error' + err);
});

app.use('/users', users);
app.use('/dishes', dishes);
app.use('/locations', locations);
app.use('/likes', likes);
app.use('/comments', comments);
app.use('/toppings', toppings);
app.use('/orders', orders);

app.get('/', function (req, res) {
	res.send('dratuti');
});

app.listen(port, function () {
	console.log('yep' + port);
});
//# sourceMappingURL=index.js.map
