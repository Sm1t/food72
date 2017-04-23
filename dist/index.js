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

var EmployeeSchema = mongoose__default.Schema({
	name: {
		type: String,
		required: true
	},
	surname: {
		type: String,
		required: true
	},
	position: {
		type: String,
		required: true
	},
	login: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	role: {
		type: String,
		required: true,
		default: 'employee'
	}
}, {
	timestamps: true
});

EmployeeSchema.methods.toJSON = function () {
	return _.pick(this, ['_id', 'name', 'surname', 'position']);
};

var Employee = mongoose__default.model('Employee', EmployeeSchema);

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

												if (!jwt_payload.login) {
													_context.next = 5;
													break;
												}

												_context.next = 4;
												return Employee.findOne({ login: jwt_payload.login });

											case 4:
												user = _context.sent;

											case 5:
												if (!jwt_payload.phone) {
													_context.next = 9;
													break;
												}

												_context.next = 8;
												return User.findOne({ phone: jwt_payload.phone });

											case 8:
												user = _context.sent;

											case 9:
												if (!user) {
													_context.next = 13;
													break;
												}

												return _context.abrupt('return', done(null, user));

											case 13:
												done(null, false);

											case 14:
												_context.next = 19;
												break;

											case 16:
												_context.prev = 16;
												_context.t0 = _context['catch'](0);
												return _context.abrupt('return', done(_context.t0, false));

											case 19:
											case 'end':
												return _context.stop();
										}
									}
								}, _callee, _this, [[0, 16]]);
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
	dishId: {
		type: Schema$1.Types.ObjectId,
		ref: 'Dish',
		required: true
	},
	userId: {
		type: Schema$1.Types.ObjectId,
		ref: 'Dish',
		required: true
	}
}, {
	timestamps: true
});

LikeSchema.methods.toJSON = function () {
	return _.pick(this, ['dishId', 'userId']);
};

var Like = mongoose__default.model('Like', LikeSchema);

var CommentSchema = mongoose__default.Schema({
	dish: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Dish',
		required: true
	},
	userId: {
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

var access = (function (req, res, next) {
	var userAccess = ['/likes', '/comments', '/orders'];
	var employeeAccess = ['/dishes', '/toppings', '/locations', '/menu'];
	var adminAccess = ['/employees'];

	if (req.user) {
		if (adminAccess.indexOf(req.originalUrl) != -1) {
			if (req.user.role === 'admin') return next();
			return res.status(403).json({ success: false, msg: 'Access denied' });
		}

		if (employeeAccess.indexOf(req.originalUrl) != -1) {
			if (req.user.login) return next();
			return res.status(403).json({ success: false, msg: 'Access denied' });
		}

		if (userAccess.indexOf(req.originalUrl) != -1) {
			if (req.user.phone) return next();
			return res.status(401).json({ success: false, msg: 'Unauthorized' });
		}
	}

	return res.status(403).json({ success: false, msg: 'Access denied' });
});

var checkId = (function (req, res, next) {
	var id = req.params.id;
	var re = new RegExp('(^[0-9a-fA-F]{24}$)');
	if (!id.match(re)) {
		return res.status(400).json({ success: false, msg: 'Incorrect ' + modelName + ' id' });
	}
	return next();
});

var defaultRoutes = function () {
	function defaultRoutes() {
		_classCallCheck(this, defaultRoutes);

		this.router = express.Router();
	}

	_createClass(defaultRoutes, [{
		key: 'init',
		value: function init(model, modelName) {
			this.initGet(model, modelName);
			this.initPost(model, modelName);
			this.initChange(model, modelName);
			this.initDelete(model, modelName);
		}
	}, {
		key: 'initGet',
		value: function initGet(model, modelName) {
			var _this = this;

			this.router.get('/:id?/:select?', passport.authenticate('jwt', { session: false }), access, function () {
				var _ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee(req, res) {
					var id, select, modifiedSince, news, lastModified, opts, re, elem, _elem;

					return _regeneratorRuntime.wrap(function _callee$(_context) {
						while (1) {
							switch (_context.prev = _context.next) {
								case 0:
									id = req.params.id;
									select = req.params.select;

									if (!(!id && !select)) {
										_context.next = 38;
										break;
									}

									modifiedSince = req.headers['if-modified-since'];

									if (!modifiedSince) {
										_context.next = 27;
										break;
									}

									_context.prev = 5;

									modifiedSince = new Date(Date.parse(modifiedSince));
									_context.next = 9;
									return model.find({ "updatedAt": { $gt: modifiedSince } });

								case 9:
									news = _context.sent;

									if (!news[0]) {
										_context.next = 19;
										break;
									}

									lastModified = news.reduce(function (prev, candidate) {
										return prev.updatedAt > candidate.updatedAt ? prev : candidate;
									});

									lastModified = Date.parse(lastModified.updatedAt);
									opts = {
										year: 'numeric',
										month: 'short',
										day: 'numeric',
										weekday: 'short',
										hour: 'numeric',
										minute: 'numeric',
										second: 'numeric',
										timeZoneName: 'short',
										hour12: false
									};

									lastModified = new Date(lastModified).toLocaleString('en-US', opts);
									res.set('Last-Modified', lastModified);
									return _context.abrupt('return', res.json(news));

								case 19:
									return _context.abrupt('return', res.status(304).send());

								case 20:
									_context.next = 25;
									break;

								case 22:
									_context.prev = 22;
									_context.t0 = _context['catch'](5);

									next(_context.t0);

								case 25:
									_context.next = 38;
									break;

								case 27:
									if (!req.user.phone) {
										_context.next = 33;
										break;
									}

									_context.t1 = res;
									_context.next = 31;
									return model.find({ userId: req.user._id });

								case 31:
									_context.t2 = _context.sent;
									return _context.abrupt('return', _context.t1.json.call(_context.t1, _context.t2));

								case 33:
									_context.t3 = res;
									_context.next = 36;
									return model.find();

								case 36:
									_context.t4 = _context.sent;
									return _context.abrupt('return', _context.t3.json.call(_context.t3, _context.t4));

								case 38:
									re = new RegExp('(^[0-9a-fA-F]{24}$)');

									if (id.match(re)) {
										_context.next = 41;
										break;
									}

									return _context.abrupt('return', res.status(400).json({ success: false, msg: 'Incorrect ' + modelName + ' id' }));

								case 41:
									if (!(id && !select)) {
										_context.next = 54;
										break;
									}

									_context.prev = 42;
									_context.next = 45;
									return model.findById(id);

								case 45:
									elem = _context.sent;

									if (elem) {
										_context.next = 48;
										break;
									}

									return _context.abrupt('return', res.status(404).json({ success: false, msg: modelName + ' not found' }));

								case 48:
									return _context.abrupt('return', res.json(elem));

								case 51:
									_context.prev = 51;
									_context.t5 = _context['catch'](42);

									next(_context.t5);

								case 54:
									_context.prev = 54;
									_context.next = 57;
									return model.findById(id);

								case 57:
									_elem = _context.sent;

									if (_elem['' + select]) {
										_context.next = 60;
										break;
									}

									return _context.abrupt('return', res.json({ success: false, msg: 'Cannot select ' + select }));

								case 60:
									return _context.abrupt('return', res.json(_elem['' + select]));

								case 63:
									_context.prev = 63;
									_context.t6 = _context['catch'](54);

									next(_context.t6);

								case 66:
								case 'end':
									return _context.stop();
							}
						}
					}, _callee, _this, [[5, 22], [42, 51], [54, 63]]);
				}));

				return function (_x, _x2) {
					return _ref.apply(this, arguments);
				};
			}());
		}
	}, {
		key: 'initPost',
		value: function initPost(model, modelName) {
			var _this2 = this;

			this.router.post('', passport.authenticate('jwt', { session: false }), access, function () {
				var _ref2 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee2(req, res) {
					var elem;
					return _regeneratorRuntime.wrap(function _callee2$(_context2) {
						while (1) {
							switch (_context2.prev = _context2.next) {
								case 0:
									_context2.prev = 0;

									/*if (['orders', 'likes', 'comments'].indexOf(modelName) != -1) {
         	var elem = new model(Object.assign({}, req.body, {userId: req.user.id}));
         } else {
         	var elem = new model(req.body);
         }*/

									elem = new model(req.body);
									_context2.next = 4;
									return elem.save();

								case 4:
									return _context2.abrupt('return', res.status(201).json(elem));

								case 7:
									_context2.prev = 7;
									_context2.t0 = _context2['catch'](0);

									next(_context2.t0);

								case 10:
								case 'end':
									return _context2.stop();
							}
						}
					}, _callee2, _this2, [[0, 7]]);
				}));

				return function (_x3, _x4) {
					return _ref2.apply(this, arguments);
				};
			}());
		}
	}, {
		key: 'initChange',
		value: function initChange(model, modelNmae) {
			var _this3 = this;

			this.router.post('/:id', checkId, passport.authenticate('jwt', { session: false }), access, function () {
				var _ref3 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee3(req, res) {
					var id, elem;
					return _regeneratorRuntime.wrap(function _callee3$(_context3) {
						while (1) {
							switch (_context3.prev = _context3.next) {
								case 0:
									_context3.prev = 0;
									id = req.params.id;
									_context3.next = 4;
									return model.findById(id);

								case 4:
									elem = _context3.sent;

									if (elem) {
										_context3.next = 7;
										break;
									}

									return _context3.abrupt('return', res.status(404).json({ success: false, msg: modelName + ' not found' }));

								case 7:
									_context3.next = 9;
									return model.update({ _id: id }, { $set: req.body
									});

								case 9:
									return _context3.abrupt('return', res.json({ success: true, msg: modelName + ' updated' }));

								case 12:
									_context3.prev = 12;
									_context3.t0 = _context3['catch'](0);

									next(_context3.t0);

								case 15:
								case 'end':
									return _context3.stop();
							}
						}
					}, _callee3, _this3, [[0, 12]]);
				}));

				return function (_x5, _x6) {
					return _ref3.apply(this, arguments);
				};
			}());
		}
	}, {
		key: 'initDelete',
		value: function initDelete(model, modelName) {
			var _this4 = this;

			this.router.delete('/:id', passport.authenticate('jwt', { session: false }), access, function () {
				var _ref4 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee4(req, res) {
					var id, elem;
					return _regeneratorRuntime.wrap(function _callee4$(_context4) {
						while (1) {
							switch (_context4.prev = _context4.next) {
								case 0:
									id = req.params.id;
									_context4.prev = 1;
									_context4.next = 4;
									return model.findById(id);

								case 4:
									elem = _context4.sent;

									if (elem) {
										_context4.next = 7;
										break;
									}

									return _context4.abrupt('return', res.status(404).json({ success: false, msg: modelName + ' not found' }));

								case 7:
									_context4.next = 9;
									return elem.remove();

								case 9:
									return _context4.abrupt('return', res.json({ success: true, msg: modelName + ' deleted' }));

								case 12:
									_context4.prev = 12;
									_context4.t0 = _context4['catch'](1);

									next(_context4.t0);

								case 15:
								case 'end':
									return _context4.stop();
							}
						}
					}, _callee4, _this4, [[1, 12]]);
				}));

				return function (_x7, _x8) {
					return _ref4.apply(this, arguments);
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

						if (!exist) {
							_context.next = 5;
							break;
						}

						return _context.abrupt('return', res.status(400).json({ success: false, msg: 'User already exist' }));

					case 5:
						_context.prev = 5;
						user = new User(req.body);
						phone = user.phone;
						_context.next = 10;
						return bcrypt.genSalt(10);

					case 10:
						salt = _context.sent;
						_context.next = 13;
						return bcrypt.hash(user.password, salt);

					case 13:
						hash = _context.sent;

						user.password = hash;
						user.save();
						token = jwt.sign({ phone: phone }, config.secret, { expiresIn: 604800 });
						return _context.abrupt('return', res.status(201).json(_Object$assign({}, user.toJSON(), { token: 'JWT ' + token })));

					case 20:
						_context.prev = 20;
						_context.t0 = _context['catch'](5);

						console.log(_context.t0);
						return _context.abrupt('return', res.status(500).json({ success: false, msg: _context.t0.name }));

					case 24:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, _this, [[5, 20]]);
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

defaultUsers.router.post('/profile', passport.authenticate('jwt', { session: false }), function () {
	var _ref3 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee3(req, res) {
		return _regeneratorRuntime.wrap(function _callee3$(_context3) {
			while (1) {
				switch (_context3.prev = _context3.next) {
					case 0:
						res.json(['/dishes', 'toppings', '/locations'].indexOf(req.path));

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
	likes: {
		type: Number,
		required: true,
		default: 0
	},
	active: {
		type: Boolean,
		default: true,
		required: true
	}
}, {
	timestamps: true
});

var Dish = mongoose__default.model('Dish', DishSchema);

var _this$2 = undefined;

var ifModifiedSince = (function () {
	var _ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee(model, modifiedSince) {
		var news, lastModified, opts;
		return _regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						modifiedSince = new Date(Date.parse(modifiedSince));
						_context.next = 3;
						return model.find({ "updatedAt": { $gt: modifiedSince } });

					case 3:
						news = _context.sent;

						if (!news[0]) {
							_context.next = 12;
							break;
						}

						lastModified = news.reduce(function (prev, candidate) {
							return prev.updatedAt > candidate.updatedAt ? prev : candidate;
						});

						lastModified = Date.parse(lastModified.updatedAt);
						opts = {
							year: 'numeric',
							month: 'short',
							day: 'numeric',
							weekday: 'short',
							hour: 'numeric',
							minute: 'numeric',
							second: 'numeric',
							timeZoneName: 'short',
							hour12: false
						};

						lastModified = new Date(lastModified).toLocaleString('en-US', opts);
						return _context.abrupt('return', {
							news: news,
							lastModified: lastModified
						});

					case 12:
						return _context.abrupt('return');

					case 13:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, _this$2);
	}));

	return function (_x, _x2) {
		return _ref.apply(this, arguments);
	};
})();

var _this$1 = undefined;

var defaultDishes = new defaultRoutes();

defaultDishes.router.get('', function () {
	var _ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee(req, res, next) {
		var id, select, modifiedSince, changes;
		return _regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						id = req.params.id;
						select = req.params.select;

						if (!(!id && !select)) {
							_context.next = 27;
							break;
						}

						modifiedSince = req.headers['if-modified-since'];

						if (!modifiedSince) {
							_context.next = 22;
							break;
						}

						_context.prev = 5;
						_context.next = 8;
						return ifModifiedSince(Dish, modifiedSince);

					case 8:
						changes = _context.sent;

						if (!changes) {
							_context.next = 14;
							break;
						}

						res.set('Last-Modified', changes.lastModified);
						return _context.abrupt('return', res.json(changes.news));

					case 14:
						return _context.abrupt('return', res.status(304).send());

					case 15:
						_context.next = 20;
						break;

					case 17:
						_context.prev = 17;
						_context.t0 = _context['catch'](5);

						next(_context.t0);

					case 20:
						_context.next = 27;
						break;

					case 22:
						_context.t1 = res;
						_context.next = 25;
						return Dish.find();

					case 25:
						_context.t2 = _context.sent;
						return _context.abrupt('return', _context.t1.json.call(_context.t1, _context.t2));

					case 27:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, _this$1, [[5, 17]]);
	}));

	return function (_x, _x2, _x3) {
		return _ref.apply(this, arguments);
	};
}());

defaultDishes.initPost(Dish, 'dishes');
defaultDishes.initChange(Dish, 'dishes');
defaultDishes.initDelete(Dish, 'dishes');

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

var _this$3 = undefined;

var defaultLikes = new defaultRoutes();

defaultLikes.router.post('', passport.authenticate('jwt', { session: false }), function () {
	var _ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee(req, res, next) {
		var exist, newLike;
		return _regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						_context.prev = 0;
						_context.next = 3;
						return Like.findOne({ dishId: req.body.dishId, userId: req.user._id });

					case 3:
						exist = _context.sent;

						if (!exist) {
							_context.next = 10;
							break;
						}

						_context.next = 7;
						return Dish.update({ _id: exist.dishId }, { $inc: {
								likes: -1
							}
						});

					case 7:
						_context.next = 9;
						return exist.remove();

					case 9:
						return _context.abrupt('return', res.json({ success: true, msg: 'мнi тожi похуi' }));

					case 10:
						newLike = new Like(_Object$assign({}, req.body, { userId: req.user._id }));
						_context.next = 13;
						return newLike.save();

					case 13:
						_context.next = 15;
						return Dish.update({ _id: newLike.dishId }, { $inc: {
								likes: 1
							}
						});

					case 15:
						return _context.abrupt('return', res.status(201).json(newLike));

					case 18:
						_context.prev = 18;
						_context.t0 = _context['catch'](0);

						next(_context.t0);

					case 21:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, _this$3, [[0, 18]]);
	}));

	return function (_x, _x2, _x3) {
		return _ref.apply(this, arguments);
	};
}());

defaultLikes.router.post('/:id', checkId, function () {
	var _ref2 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee2(req, res, next) {
		return _regeneratorRuntime.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						try {} catch (err) {
							next(err);
						}

					case 1:
					case 'end':
						return _context2.stop();
				}
			}
		}, _callee2, _this$3);
	}));

	return function (_x4, _x5, _x6) {
		return _ref2.apply(this, arguments);
	};
}());

defaultLikes.initGet(Like, 'likes');

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
	userId: {
		type: Schema$2.Types.ObjectId,
		ref: 'User',
		required: true
	},
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
defaultOrders.init(Order, 'orders');

var orders = defaultOrders.router;

var _this$4 = undefined;

var defaultEmployees = new defaultRoutes();

// Register
defaultEmployees.router.post('', function () {
	var _ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee(req, res) {
		var exist, employee, login, salt, hash, token;
		return _regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						_context.next = 2;
						return Employee.findOne({ login: req.body.login });

					case 2:
						exist = _context.sent;
						;

						if (!exist) {
							_context.next = 6;
							break;
						}

						return _context.abrupt('return', res.status(400).json({ success: false, msg: 'Employee already exist' }));

					case 6:
						_context.prev = 6;
						employee = new Employee(req.body);
						login = employee.login;
						_context.next = 11;
						return bcrypt.genSalt(10);

					case 11:
						salt = _context.sent;
						_context.next = 14;
						return bcrypt.hash(employee.password, salt);

					case 14:
						hash = _context.sent;

						employee.password = hash;
						employee.save();
						token = jwt.sign({ login: login }, config.secret, { expiresIn: 604800 });
						return _context.abrupt('return', res.status(201).json(_Object$assign({}, employee.toJSON(), { token: 'JWT ' + token })));

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
		}, _callee, _this$4, [[6, 21]]);
	}));

	return function (_x, _x2) {
		return _ref.apply(this, arguments);
	};
}());

// Authenticate
defaultEmployees.router.post('/login', function () {
	var _ref2 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee2(req, res) {
		var login, password, employee, token;
		return _regeneratorRuntime.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						login = req.body.login, password = req.body.password;
						_context2.next = 3;
						return Employee.findOne({ login: login });

					case 3:
						employee = _context2.sent;

						if (employee) {
							_context2.next = 6;
							break;
						}

						return _context2.abrupt('return', res.status(404).json({ success: false, msg: "Employee not found" }));

					case 6:
						_context2.prev = 6;
						_context2.next = 9;
						return bcrypt.compare(password, employee.password);

					case 9:
						if (!_context2.sent) {
							_context2.next = 14;
							break;
						}

						token = jwt.sign({ login: login }, config.secret, { expiresIn: 604800 });
						return _context2.abrupt('return', res.json(_Object$assign({}, employee.toJSON(), { token: 'JWT ' + token })));

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
		}, _callee2, _this$4, [[6, 17]]);
	}));

	return function (_x3, _x4) {
		return _ref2.apply(this, arguments);
	};
}());

defaultEmployees.router.post('/profile', passport.authenticate('jwt', { session: false }), function () {
	var _ref3 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee3(req, res) {
		return _regeneratorRuntime.wrap(function _callee3$(_context3) {
			while (1) {
				switch (_context3.prev = _context3.next) {
					case 0:
						res.json(req.user);

					case 1:
					case 'end':
						return _context3.stop();
				}
			}
		}, _callee3, _this$4);
	}));

	return function (_x5, _x6) {
		return _ref3.apply(this, arguments);
	};
}());

defaultEmployees.init(Employee, 'employees');

var employees = defaultEmployees.router;

var app = express();
var bodyParser = require('body-parser');
Passport(passport);

app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/static', express.static(path.join(__dirname, 'jenya')));
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

app.get('/', function (req, res) {
	res.send('dratuti');
});

app.use('/users', users);
app.use('/dishes', dishes);
app.use('/locations', locations);
app.use('/likes', likes);
app.use('/comments', comments);
app.use('/toppings', toppings);
app.use('/orders', orders);
app.use('/employees', employees);

app.use(function (err, req, res, next) {
	console.log(err);
	return res.status(500).json({ success: false, msg: err.name });
});

app.listen(port, function () {
	console.log('yep' + port);
});
//# sourceMappingURL=index.js.map
