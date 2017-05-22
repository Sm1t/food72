'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var express = _interopDefault(require('express'));
var cors = _interopDefault(require('cors'));
var mongoose = require('mongoose');
var mongoose__default = _interopDefault(mongoose);
var Promise = _interopDefault(require('bluebird'));
var path = _interopDefault(require('path'));
var passport = _interopDefault(require('passport'));
var fs = _interopDefault(require('fs'));
var _regeneratorRuntime = _interopDefault(require('babel-runtime/regenerator'));
var _asyncToGenerator = _interopDefault(require('babel-runtime/helpers/asyncToGenerator'));
var bcrypt = _interopDefault(require('bcryptjs'));
var _ = _interopDefault(require('lodash'));
var _JSON$stringify = _interopDefault(require('babel-runtime/core-js/json/stringify'));
var _Object$assign = _interopDefault(require('babel-runtime/core-js/object/assign'));
var jwt = _interopDefault(require('jsonwebtoken'));
var _classCallCheck = _interopDefault(require('babel-runtime/helpers/classCallCheck'));
var _createClass = _interopDefault(require('babel-runtime/helpers/createClass'));
var _toConsumableArray = _interopDefault(require('babel-runtime/helpers/toConsumableArray'));

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

UserSchema.pre('save', function (next) {
	var _this = this;

	return bcrypt.genSalt(10).then(function (salt) {
		bcrypt.hash(_this.password, salt).then(function (hash) {
			_this.password = hash;
			next();
		});
	}).catch(next);
});

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

EmployeeSchema.pre('save', function (next) {
	var _this = this;

	return bcrypt.genSalt(10).then(function (salt) {
		bcrypt.hash(_this.password, salt).then(function (hash) {
			_this.password = hash;
			next();
		});
	}).catch(next);
});

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

DishSchema.methods.toJSON = function () {
	return _.omit(this.toObject(), ['updatedAt', 'createdAt']);
};

DishSchema.methods.updateLikesCount = function () {
	var dish = this;
	return Like.count({ dishId: dish._id }).then(function (count) {
		dish.likes = count;
		return dish.save();
	});
};

var Dish = mongoose__default.model('Dish', DishSchema);

var _this$1 = undefined;

var updateRating = (function () {
	var _ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee(dishId, valuation) {
		var commentsCount, currentRating;
		return _regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						_context.next = 2;
						return Comment.find().count();

					case 2:
						commentsCount = _context.sent;
						_context.next = 5;
						return Dish.findOne({ _id: dishId });

					case 5:
						currentRating = _context.sent.rating;
						return _context.abrupt('return', Dish.update({ _id: dishId }, { $set: {
								rating: (valuation + currentRating * (commentsCount - 1)) / commentsCount
							} }));

					case 7:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, _this$1);
	}));

	return function (_x, _x2) {
		return _ref.apply(this, arguments);
	};
})();

var CommentSchema = mongoose__default.Schema({
	dishId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Dish',
		required: true
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
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

CommentSchema.post('save', function (next) {
	return updateRating(this.dishId, this.rating).catch(next);
});

var Comment = mongoose__default.model('Comment', CommentSchema);

var checkId = (function (req, res, next) {
	var id = req.params.id;
	if (!id) return next();
	var re = new RegExp('(^[0-9a-fA-F]{24}$)');
	if (!id.match(re)) {
		return res.status(400).json({ success: false, msg: 'Incorrect id' });
	}
	return next();
});

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
						return model.find({ "updatedAt": { $gt: modifiedSince + '.999Z' } });

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

var _this$3 = undefined;

var getLastModified = (function () {
	var _ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee(model) {
		var arr, lastModified, opts;
		return _regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						_context.next = 2;
						return model.find();

					case 2:
						arr = _context.sent;

						if (arr[0]) {
							_context.next = 5;
							break;
						}

						return _context.abrupt('return');

					case 5:
						lastModified = arr.reduce(function (prev, candidate) {
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
						return _context.abrupt('return', lastModified);

					case 10:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, _this$3);
	}));

	return function (_x) {
		return _ref.apply(this, arguments);
	};
})();

var defaultRoutes$1 = function () {
	function defaultRoutes(params) {
		_classCallCheck(this, defaultRoutes);

		_Object$assign(this, params);
		this.router = express.Router();
	}

	_createClass(defaultRoutes, [{
		key: 'init',
		value: function init(model, modelName) {
			this.initGet(model, modelName);
			this.initPost(model, modelName);
			this.initPut(model, modelName);
			this.initDelete(model, modelName);
		}
	}, {
		key: 'initGet',
		value: function initGet(model, modelName) {
			var _this = this;

			this.router.get('/:id?/:select?', checkId, this.getMiddlewares || [], function () {
				var _ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee(req, res, next) {
					var id, select, modifiedSince, changes, lastModified, _elem, elem;

					return _regeneratorRuntime.wrap(function _callee$(_context) {
						while (1) {
							switch (_context.prev = _context.next) {
								case 0:
									id = req.params.id;
									select = req.params.select;
									_context.prev = 2;

									if (!(!id && !select)) {
										_context.next = 32;
										break;
									}

									modifiedSince = req.headers['if-modified-since'];

									if (!modifiedSince) {
										_context.next = 17;
										break;
									}

									_context.next = 8;
									return ifModifiedSince(model, modifiedSince);

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
									_context.next = 32;
									break;

								case 17:
									if (!(req.user && req.user.phone)) {
										_context.next = 23;
										break;
									}

									_context.t0 = res;
									_context.next = 21;
									return model.find({ userId: req.user._id }).populate(_this.populate || '');

								case 21:
									_context.t1 = _context.sent;
									return _context.abrupt('return', _context.t0.json.call(_context.t0, _context.t1));

								case 23:
									_context.next = 25;
									return getLastModified(model);

								case 25:
									lastModified = _context.sent;

									res.set('Last-Modified', lastModified);
									_context.t2 = res;
									_context.next = 30;
									return model.find().populate(_this.populate || '');

								case 30:
									_context.t3 = _context.sent;
									return _context.abrupt('return', _context.t2.json.call(_context.t2, _context.t3));

								case 32:
									if (!(id && !select)) {
										_context.next = 39;
										break;
									}

									_context.next = 35;
									return model.findById(id).populate(_this.populate || '');

								case 35:
									_elem = _context.sent;

									if (_elem) {
										_context.next = 38;
										break;
									}

									return _context.abrupt('return', res.status(404).json({ success: false, msg: modelName + ' not found' }));

								case 38:
									return _context.abrupt('return', res.json(_elem));

								case 39:
									_context.next = 41;
									return model.findById(id);

								case 41:
									elem = _context.sent;

									if (elem['' + select]) {
										_context.next = 44;
										break;
									}

									return _context.abrupt('return', res.json({ success: false, msg: 'Cannot select ' + select }));

								case 44:
									return _context.abrupt('return', res.json(elem['' + select]));

								case 47:
									_context.prev = 47;
									_context.t4 = _context['catch'](2);

									next(_context.t4);

								case 50:
								case 'end':
									return _context.stop();
							}
						}
					}, _callee, _this, [[2, 47]]);
				}));

				return function (_x, _x2, _x3) {
					return _ref.apply(this, arguments);
				};
			}());
		}
	}, {
		key: 'initPost',
		value: function initPost(model, modelName) {
			var _this2 = this;

			this.router.post('', this.postMiddlewares || [], function () {
				var _ref2 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee2(req, res, next) {
					var exist, elem;
					return _regeneratorRuntime.wrap(function _callee2$(_context2) {
						while (1) {
							switch (_context2.prev = _context2.next) {
								case 0:
									_context2.prev = 0;

									if (!(!_this2.canRepeated || _this2.canRepeated != true)) {
										_context2.next = 7;
										break;
									}

									_context2.next = 4;
									return model.findOne(req.body);

								case 4:
									exist = _context2.sent;

									if (!exist) {
										_context2.next = 7;
										break;
									}

									return _context2.abrupt('return', res.status(400).json({ success: false, msg: modelName + ' aready exist' }));

								case 7:

									if (req.user && req.user._id) {
										elem = new model(_Object$assign(req.body, { userId: req.user._id }));
									} else {
										elem = new model(req.body);
									}

									_context2.next = 10;
									return elem.save();

								case 10:
									return _context2.abrupt('return', res.status(201).json(elem));

								case 13:
									_context2.prev = 13;
									_context2.t0 = _context2['catch'](0);

									next(_context2.t0);

								case 16:
								case 'end':
									return _context2.stop();
							}
						}
					}, _callee2, _this2, [[0, 13]]);
				}));

				return function (_x4, _x5, _x6) {
					return _ref2.apply(this, arguments);
				};
			}());
		}
	}, {
		key: 'initPut',
		value: function initPut(model, modelName) {
			var _this3 = this;

			this.router.put('/:id', checkId, this.putMiddlewares || [], function () {
				var _ref3 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee3(req, res, next) {
					var id, elem;
					return _regeneratorRuntime.wrap(function _callee3$(_context3) {
						while (1) {
							switch (_context3.prev = _context3.next) {
								case 0:
									id = req.params.id;
									_context3.prev = 1;
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
									_context3.t0 = _context3['catch'](1);

									next(_context3.t0);

								case 15:
								case 'end':
									return _context3.stop();
							}
						}
					}, _callee3, _this3, [[1, 12]]);
				}));

				return function (_x7, _x8, _x9) {
					return _ref3.apply(this, arguments);
				};
			}());
		}
	}, {
		key: 'initDelete',
		value: function initDelete(model, modelName) {
			var _this4 = this;

			this.router.delete('/:id', checkId, this.deleteMiddlewares || [], function () {
				var _ref4 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee4(req, res, next) {
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

				return function (_x10, _x11, _x12) {
					return _ref4.apply(this, arguments);
				};
			}());
		}
	}]);

	return defaultRoutes;
}();

var _this = undefined;

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var defaultUsers = new defaultRoutes$1();

// Register
defaultUsers.router.post('', function () {
	var _ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee(req, res, next) {
		var exist, user, phone, token;
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
						user = new User(req.body), phone = user.phone;

						user.save();
						token = jwt.sign({ phone: phone }, config.secret, { expiresIn: 604800 });
						return _context.abrupt('return', res.status(201).json(_Object$assign({}, user.toJSON(), { token: 'JWT ' + token })));

					case 12:
						_context.prev = 12;
						_context.t0 = _context['catch'](5);

						next(_context.t0);

					case 15:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, _this, [[5, 12]]);
	}));

	return function (_x, _x2, _x3) {
		return _ref.apply(this, arguments);
	};
}());

// login
defaultUsers.router.post('/login', function () {
	var _ref2 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee2(req, res, next) {
		var phone, password, user, token;
		return _regeneratorRuntime.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						phone = req.body.phone, password = req.body.password;
						_context2.prev = 1;
						_context2.next = 4;
						return User.findOne({ phone: phone });

					case 4:
						user = _context2.sent;

						if (user) {
							_context2.next = 7;
							break;
						}

						return _context2.abrupt('return', res.status(404).json({ success: false, msg: "User not found" }));

					case 7:
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
						_context2.t0 = _context2['catch'](1);

						next(_context2.t0);

					case 20:
					case 'end':
						return _context2.stop();
				}
			}
		}, _callee2, _this, [[1, 17]]);
	}));

	return function (_x4, _x5, _x6) {
		return _ref2.apply(this, arguments);
	};
}());

defaultUsers.router.post('/avatars', multipartMiddleware, passport.authenticate('jwt', { session: false }), function () {
	var _ref3 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee4(req, res, next) {
		var img, oldImage;
		return _regeneratorRuntime.wrap(function _callee4$(_context4) {
			while (1) {
				switch (_context4.prev = _context4.next) {
					case 0:
						img = req.files.avatar;

						fs.writeFile(__dirname + '/debug.txt', _JSON$stringify(req.files), function (err) {
							if (err) throw err;
						});

						_context4.next = 4;
						return User.findById(req.user._id);

					case 4:
						oldImage = _context4.sent.avatar;

						oldImage = path.resolve(__dirname, '../uploads/avatars') + '/' + oldImage.split('/avatars/')[1];
						fs.unlink(oldImage, function (err) {
							if (err) throw err;
						});

						fs.readFile(img.path, function (err, data) {
							if (err) next(err);
							var way = path.resolve(__dirname, '../uploads/avatars') + '/' + img.originalFilename;
							fs.writeFile(way, data, function () {
								var _ref4 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee3(err) {
									var link;
									return _regeneratorRuntime.wrap(function _callee3$(_context3) {
										while (1) {
											switch (_context3.prev = _context3.next) {
												case 0:
													if (err) next(err);
													link = 'http://arusremservis.ru/users/avatars/' + img.originalFilename;
													_context3.next = 4;
													return User.findOneAndUpdate({ _id: req.user._id }, { $set: {
															avatar: link
														} });

												case 4:
													res.json({ success: true, link: link });

												case 5:
												case 'end':
													return _context3.stop();
											}
										}
									}, _callee3, _this);
								}));

								return function (_x10) {
									return _ref4.apply(this, arguments);
								};
							}());
						});

					case 8:
					case 'end':
						return _context4.stop();
				}
			}
		}, _callee4, _this);
	}));

	return function (_x7, _x8, _x9) {
		return _ref3.apply(this, arguments);
	};
}());

defaultUsers.router.get('/avatars/:img', function () {
	var _ref5 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee5(req, res) {
		return _regeneratorRuntime.wrap(function _callee5$(_context5) {
			while (1) {
				switch (_context5.prev = _context5.next) {
					case 0:
						try {
							res.sendFile(path.resolve(__dirname, '../uploads/avatars') + '/' + req.params.img);
						} catch (err) {
							res.send(err);
						}

					case 1:
					case 'end':
						return _context5.stop();
				}
			}
		}, _callee5, _this);
	}));

	return function (_x11, _x12) {
		return _ref5.apply(this, arguments);
	};
}());

defaultUsers.router.put('', passport.authenticate('jwt', { session: false }), function () {
	var _ref6 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee6(req, res, next) {
		var user;
		return _regeneratorRuntime.wrap(function _callee6$(_context6) {
			while (1) {
				switch (_context6.prev = _context6.next) {
					case 0:
						_context6.prev = 0;
						_context6.next = 3;
						return User.findOneAndUpdate({ _id: req.user._id }, { $set: req.body,
							returnNewDocument: true
						});

					case 3:
						user = _context6.sent;
						return _context6.abrupt('return', res.json(user));

					case 7:
						_context6.prev = 7;
						_context6.t0 = _context6['catch'](0);

						next(_context6.t0);

					case 10:
					case 'end':
						return _context6.stop();
				}
			}
		}, _callee6, _this, [[0, 7]]);
	}));

	return function (_x13, _x14, _x15) {
		return _ref6.apply(this, arguments);
	};
}());

defaultUsers.router.delete('', passport.authenticate('jwt', { session: false }), function () {
	var _ref7 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee7(req, res, next) {
		return _regeneratorRuntime.wrap(function _callee7$(_context7) {
			while (1) {
				switch (_context7.prev = _context7.next) {
					case 0:
						_context7.prev = 0;
						_context7.next = 3;
						return User.findOneAndRemove({ _id: req.user._id });

					case 3:
						return _context7.abrupt('return', res.json({ success: true, msg: 'User updated' }));

					case 6:
						_context7.prev = 6;
						_context7.t0 = _context7['catch'](0);

						next(_context7.t0);

					case 9:
					case 'end':
						return _context7.stop();
				}
			}
		}, _callee7, _this, [[0, 6]]);
	}));

	return function (_x16, _x17, _x18) {
		return _ref7.apply(this, arguments);
	};
}());

defaultUsers.router.post('/profile', passport.authenticate('jwt', { session: false }), function () {
	var _ref8 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee8(req, res) {
		return _regeneratorRuntime.wrap(function _callee8$(_context8) {
			while (1) {
				switch (_context8.prev = _context8.next) {
					case 0:
						res.json(['/dishes', 'toppings', '/locations'].indexOf(req.path));

					case 1:
					case 'end':
						return _context8.stop();
				}
			}
		}, _callee8, _this);
	}));

	return function (_x19, _x20) {
		return _ref8.apply(this, arguments);
	};
}());

defaultUsers.initGet(User, 'user');

var users = defaultUsers.router;

var defaultDishes = new defaultRoutes$1();

defaultDishes.init(Dish, 'dish');

var dishes = defaultDishes.router;

var Schema$2 = mongoose__default.Schema;


var daySchema = new Schema$2({
	workingHours: {
		type: String,
		required: true
	},
	break: [{
		type: String,
		required: true
	}]
}, {
	_id: false
});

var LocationSchema = mongoose__default.Schema({
	name: {
		type: String,
		required: true
	},
	number: {
		type: Number,
		required: true
	},
	workingTime: {
		monday: daySchema,
		tuesday: daySchema,
		wednesday: daySchema,
		thursday: daySchema,
		friday: daySchema,
		saturday: daySchema
	}
}, {
	timestamps: true
});

var Location = mongoose__default.model('Location', LocationSchema);

var defaultLocations = new defaultRoutes$1();

defaultLocations.init(Location, 'locations');

var locations = defaultLocations.router;

var _this$4 = undefined;

var defaultLikes = new defaultRoutes$1();

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
							_context.next = 11;
							break;
						}

						_context.next = 7;
						return exist.remove();

					case 7:
						_context.next = 9;
						return Dish.findOne({ _id: req.body.dishId });

					case 9:
						_context.sent.updateLikesCount();

						return _context.abrupt('return', res.json({ success: true, msg: 'Like deleted' }));

					case 11:
						newLike = new Like(_Object$assign({}, req.body, { userId: req.user._id }));
						_context.next = 14;
						return newLike.save();

					case 14:
						_context.next = 16;
						return Dish.findOne({ _id: req.body.dishId });

					case 16:
						_context.sent.updateLikesCount();

						return _context.abrupt('return', res.status(201).json(newLike));

					case 20:
						_context.prev = 20;
						_context.t0 = _context['catch'](0);

						next(_context.t0);

					case 23:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, _this$4, [[0, 20]]);
	}));

	return function (_x, _x2, _x3) {
		return _ref.apply(this, arguments);
	};
}());

defaultLikes.initGet(Like, 'like');

var likes = defaultLikes.router;

var defaultComments = new defaultRoutes$1({ canRepeated: true });
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

var defaultToppings = new defaultRoutes$1();
defaultToppings.init(Topping, 'topping');

var toppings = defaultToppings.router;

var _this$5 = undefined;

var getUniqueNumber = _asyncToGenerator(_regeneratorRuntime.mark(function _callee() {
	var arr, orders, usedNumbers, unique;
	return _regeneratorRuntime.wrap(function _callee$(_context) {
		while (1) {
			switch (_context.prev = _context.next) {
				case 0:
					arr = [].concat(_toConsumableArray(Array(10).keys())).splice(1);
					_context.next = 3;
					return Order.find();

				case 3:
					orders = _context.sent;
					usedNumbers = [];

					orders.map(function (order) {
						usedNumbers.push(order.number);
					});
					unique = arr.filter(function (value) {
						return usedNumbers.indexOf(value) == -1;
					});
					return _context.abrupt('return', unique[0]);

				case 8:
				case 'end':
					return _context.stop();
			}
		}
	}, _callee, _this$5);
}));

var Schema$3 = mongoose__default.Schema;

var OrderSchema = mongoose__default.Schema({
	user: {
		type: Schema$3.Types.ObjectId,
		ref: 'User'
	},
	dishes: [{
		dish: {
			type: Schema$3.Types.ObjectId,
			ref: 'Dish',
			required: true
		},
		quantity: {
			type: Number,
			required: true,
			default: 1
		},
		_id: false
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
	},
	number: {
		type: Number
	}
}, {
	timestamps: true
});

OrderSchema.pre('save', function (next) {
	var _this = this;

	return getUniqueNumber().then(function (unique) {
		_this.number = unique;
		next();
	}).catch(next);
});

OrderSchema.methods.toJSON = function () {
	return _.pick(this, ['_id', 'user', 'dishes', 'payStatus', 'completed', 'status', 'totalPrice', 'time', 'number']);
};

var Order = mongoose__default.model('Order', OrderSchema);

var defaultOrders = new defaultRoutes$1({
	postMiddlewares: [passport.authenticate('jwt', { session: false })],
	canRepeated: true,
	populate: 'user dishes.dish'
});

defaultOrders.init(Order, 'order');

var orders = defaultOrders.router;

var _this$6 = undefined;

var params = {
	getMiddlewares: [], //middlewares for 'get' request
	postMiddlewares: [], //middlewares for 'post' request
	deleteMiddlewares: [], //middlewares for 'delete' request
	putMiddlewares: [] //middlewares for 'put' request
};

var defaultEmployees = new defaultRoutes$1(params);

// Register
defaultEmployees.router.post('', function () {
	var _ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee(req, res) {
		var exist, employee, login, token;
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
						employee = new Employee(req.body), login = employee.login;

						employee.save();
						token = jwt.sign({ login: login }, config.secret, { expiresIn: 604800 });
						return _context.abrupt('return', res.status(201).json(_Object$assign({}, employee.toJSON(), { token: 'JWT ' + token })));

					case 13:
						_context.prev = 13;
						_context.t0 = _context['catch'](6);

						console.log(_context.t0);
						return _context.abrupt('return', res.status(500).json({ success: false, msg: _context.t0.name }));

					case 17:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, _this$6, [[6, 13]]);
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
		}, _callee2, _this$6, [[6, 17]]);
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
		}, _callee3, _this$6);
	}));

	return function (_x5, _x6) {
		return _ref3.apply(this, arguments);
	};
}());

defaultEmployees.initGet(Employee, 'employees');
defaultEmployees.initPut(Employee, 'employees');

var employees = defaultEmployees.router;

var app = express();
var bodyParser = require('body-parser');
Passport(passport);

app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/static', express.static(path.join(__dirname + '/site')));
var port = 3000;

app.disable('x-powered-by');

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

app.use(function (req, res, next) {
	return res.status(404).json({ msg: '404 Not Found' });
});

app.use(function (err, req, res, next) {
	console.log(err);
	return res.status(500).json({ success: false, msg: err.name });
});

app.listen(port, function () {
	console.log('yep' + port);
});
//# sourceMappingURL=index.js.map
