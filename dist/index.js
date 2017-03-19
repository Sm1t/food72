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
var jwt = _interopDefault(require('jsonwebtoken'));
var bcrypt = _interopDefault(require('bcryptjs'));

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
		type: String
	}
}, {
	timestamps: true
});

UserSchema.methods.getUserById = function () {
	var _ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee(userId) {
		return _regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						_context.next = 2;
						return User.findById({ id: userId });

					case 2:
						return _context.abrupt('return', _context.sent);

					case 3:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, this);
	}));

	return function (_x) {
		return _ref.apply(this, arguments);
	};
}();

UserSchema.statics.hashPassword = function () {
	var _ref2 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee2(password) {
		var salt, hash;
		return _regeneratorRuntime.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						_context2.prev = 0;
						_context2.next = 3;
						return bcrypt.genSalt(10);

					case 3:
						salt = _context2.sent;
						_context2.next = 6;
						return bcrypt.hash(password, salt);

					case 6:
						hash = _context2.sent;
						return _context2.abrupt('return', hash);

					case 10:
						_context2.prev = 10;
						_context2.t0 = _context2['catch'](0);
						throw _context2.t0;

					case 13:
					case 'end':
						return _context2.stop();
				}
			}
		}, _callee2, this, [[0, 10]]);
	}));

	return function (_x2) {
		return _ref2.apply(this, arguments);
	};
}();

UserSchema.statics.comparePassword = function () {
	var _ref3 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee3(candidatePassword, hash) {
		var isMatch;
		return _regeneratorRuntime.wrap(function _callee3$(_context3) {
			while (1) {
				switch (_context3.prev = _context3.next) {
					case 0:
						console.log('try compare');
						_context3.prev = 1;
						_context3.next = 4;
						return bcrypt.compare(candidatePassword, hash);

					case 4:
						isMatch = _context3.sent;

						console.log(isMatch);
						return _context3.abrupt('return', isMatch);

					case 9:
						_context3.prev = 9;
						_context3.t0 = _context3['catch'](1);
						throw _context3.t0;

					case 12:
					case 'end':
						return _context3.stop();
				}
			}
		}, _callee3, this, [[1, 9]]);
	}));

	return function (_x3, _x4) {
		return _ref3.apply(this, arguments);
	};
}();

var User$1 = mongoose__default.model('User', UserSchema);

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

var _this = undefined;

var router = express.Router();

// Register
router.post('/register', function () {
	var _ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee(req, res) {
		var data, exist, user, hash, phone, token;
		return _regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						data = req.body;
						_context.next = 3;
						return User$1.findOne({ phone: data.phone });

					case 3:
						exist = _context.sent;

						if (!exist) {
							_context.next = 6;
							break;
						}

						return _context.abrupt('return', res.json({ success: false, msg: 'User already exist' }));

					case 6:
						_context.prev = 6;
						user = new User$1(data);
						_context.next = 10;
						return User$1.hashPassword(user.password);

					case 10:
						hash = _context.sent;

						user.password = hash;
						phone = user.phone;

						user.save();
						token = jwt.sign({ phone: phone }, config.secret, {
							expiresIn: 604800 // 1 week
						});
						return _context.abrupt('return', res.json({ user: user, token: 'JWT ' + token }));

					case 18:
						_context.prev = 18;
						_context.t0 = _context['catch'](6);
						return _context.abrupt('return', res.status(500).json(_context.t0));

					case 21:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, _this, [[6, 18]]);
	}));

	return function (_x, _x2) {
		return _ref.apply(this, arguments);
	};
}());

// Authenticate
router.post('/auth', function () {
	var _ref2 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee2(req, res) {
		var phone, password, user, isMatch, token;
		return _regeneratorRuntime.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						phone = req.body.phone;
						password = req.body.password;
						_context2.next = 4;
						return User$1.findOne({ phone: phone });

					case 4:
						user = _context2.sent;

						if (user) {
							_context2.next = 7;
							break;
						}

						return _context2.abrupt('return', res.status(403).json({ success: false, msg: 'User not found' }));

					case 7:

						console.log(password, user.password);

						_context2.prev = 8;
						_context2.next = 11;
						return User$1.comparePassword(password, user.password);

					case 11:
						isMatch = _context2.sent;

						if (!isMatch) {
							_context2.next = 17;
							break;
						}

						token = jwt.sign({ phone: phone }, config.secret, {
							expiresIn: 604800 // 1 week
						});

						res.json({ success: true, token: 'JWT ' + token });
						_context2.next = 18;
						break;

					case 17:
						return _context2.abrupt('return', res.status(403).json({ success: false, msg: 'Wrong password' }));

					case 18:
						_context2.next = 23;
						break;

					case 20:
						_context2.prev = 20;
						_context2.t0 = _context2['catch'](8);
						throw _context2.t0;

					case 23:
					case 'end':
						return _context2.stop();
				}
			}
		}, _callee2, _this, [[8, 20]]);
	}));

	return function (_x3, _x4) {
		return _ref2.apply(this, arguments);
	};
}());

router.get('/profile', passport.authenticate('jwt', { session: false }), function () {
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

// Find user by id
router.get('/:userId?/:selection?', function () {
	var _ref4 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee4(req, res) {
		var userId, selection, arr, users, re, user, likes, comments;
		return _regeneratorRuntime.wrap(function _callee4$(_context4) {
			while (1) {
				switch (_context4.prev = _context4.next) {
					case 0:
						userId = req.params.userId;
						selection = req.params.selection;
						arr = ['likes', 'comments'];

						if (!(!userId && !selection)) {
							_context4.next = 8;
							break;
						}

						_context4.next = 6;
						return User$1.find();

					case 6:
						users = _context4.sent;
						return _context4.abrupt('return', res.json(users));

					case 8:
						re = new RegExp('(^[0-9a-fA-F]{24}$)');

						if (userId.match(re)) {
							_context4.next = 11;
							break;
						}

						return _context4.abrupt('return', res.status(400).json({ success: false, msg: 'Incorrect userId' }));

					case 11:
						_context4.next = 13;
						return User$1.findOne({ _id: userId });

					case 13:
						user = _context4.sent;

						if (!(userId && !selection)) {
							_context4.next = 18;
							break;
						}

						if (user) {
							_context4.next = 17;
							break;
						}

						return _context4.abrupt('return', res.status(404).json({ succuss: false, msg: 'User not found' }));

					case 17:
						return _context4.abrupt('return', res.json(user));

					case 18:
						if (!(arr.indexOf('' + selection) != -1)) {
							_context4.next = 34;
							break;
						}

						_context4.t0 = selection;
						_context4.next = _context4.t0 === 'likes' ? 22 : _context4.t0 === 'comments' ? 27 : 32;
						break;

					case 22:
						_context4.next = 24;
						return Like.find({ user: user._id });

					case 24:
						likes = _context4.sent;
						return _context4.abrupt('return', res.json(likes));

					case 27:
						_context4.next = 29;
						return Comment.find({ user: user._id });

					case 29:
						comments = _context4.sent;
						return _context4.abrupt('return', res.json(comments));

					case 32:
						_context4.next = 35;
						break;

					case 34:
						return _context4.abrupt('return', res.status(400).json({ success: false, msg: 'Bad Request' }));

					case 35:
					case 'end':
						return _context4.stop();
				}
			}
		}, _callee4, _this);
	}));

	return function (_x7, _x8) {
		return _ref4.apply(this, arguments);
	};
}());

// Change users fields
router.post('/:userId?', function () {
	var _ref5 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee5(req, res) {
		var userId, re, user, changes;
		return _regeneratorRuntime.wrap(function _callee5$(_context5) {
			while (1) {
				switch (_context5.prev = _context5.next) {
					case 0:
						userId = req.params.userId;
						re = new RegExp('(^[0-9a-fA-F]{24}$)');

						if (!(!userId || !userId.match(re))) {
							_context5.next = 4;
							break;
						}

						return _context5.abrupt('return', res.status(400).json({ success: false, msg: 'Incorrect userId' }));

					case 4:
						_context5.next = 6;
						return User$1.findOne({ _id: userId });

					case 6:
						user = _context5.sent;

						if (user) {
							_context5.next = 9;
							break;
						}

						return _context5.abrupt('return', res.status(404).json({ success: false, msg: 'User not found' }));

					case 9:
						_context5.prev = 9;
						changes = req.body;
						_context5.next = 13;
						return User$1.update({ _id: userId }, { $set: changes
						});

					case 13:
						_context5.t0 = res;
						_context5.next = 16;
						return User$1.findOne({ _id: userId });

					case 16:
						_context5.t1 = _context5.sent;
						return _context5.abrupt('return', _context5.t0.json.call(_context5.t0, _context5.t1));

					case 20:
						_context5.prev = 20;
						_context5.t2 = _context5['catch'](9);

						console.log(_context5.t2);
						return _context5.abrupt('return', res.status(500).json({ success: false, msg: 'Server Error', Error_name: _context5.t2.name, Error_msg: _context5.t2.message }));

					case 24:
					case 'end':
						return _context5.stop();
				}
			}
		}, _callee5, _this, [[9, 20]]);
	}));

	return function (_x9, _x10) {
		return _ref5.apply(this, arguments);
	};
}());

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
	active: {
		type: Boolean,
		default: true,
		required: true
	}
}, {
	timestamps: true
});

var Dish = mongoose__default.model('Dish', DishSchema);

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

(function () {
	var _ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee(elem) {
		return _regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						_context.prev = 0;
						_context.next = 3;
						return elem.save();

					case 3:
						return _context.abrupt('return', {
							elem: elem
						});

					case 6:
						_context.prev = 6;
						_context.t0 = _context['catch'](0);
						throw _context.t0;

					case 9:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, this, [[0, 6]]);
	}));

	function test(_x) {
		return _ref.apply(this, arguments);
	}

	return test;
})();

/*
			const promises = data.dish.map((elem) => {
				console.log('2');
				const dishData = Object.assign({}, elem);
				return (new Dish(dishData)).save();
			})
		return {
			dish: await Promise.all(promises)
		}
*/

var _this$1 = undefined;

var router$1 = express.Router();
// Show likes List
router$1.get('/likes', function () {
	var _ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee(req, res) {
		var likes;
		return _regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						_context.next = 2;
						return Like.find();

					case 2:
						likes = _context.sent;
						return _context.abrupt('return', res.json(likes));

					case 4:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, _this$1);
	}));

	return function (_x, _x2) {
		return _ref.apply(this, arguments);
	};
}());
// Add Like
router$1.post('/likes', function () {
	var _ref2 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee2(req, res) {
		var data;
		return _regeneratorRuntime.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						_context2.prev = 0;
						data = req.body;

						new Like(data).save();
						return _context2.abrupt('return', res.json('okay'));

					case 6:
						_context2.prev = 6;
						_context2.t0 = _context2['catch'](0);
						return _context2.abrupt('return', res.status(500).json({ success: false, msg: 'Server error:' }));

					case 9:
					case 'end':
						return _context2.stop();
				}
			}
		}, _callee2, _this$1, [[0, 6]]);
	}));

	return function (_x3, _x4) {
		return _ref2.apply(this, arguments);
	};
}());

// Show comments List
router$1.get('/comments', function () {
	var _ref3 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee3(req, res) {
		var comments;
		return _regeneratorRuntime.wrap(function _callee3$(_context3) {
			while (1) {
				switch (_context3.prev = _context3.next) {
					case 0:
						_context3.next = 2;
						return Comment.find();

					case 2:
						comments = _context3.sent;
						return _context3.abrupt('return', res.json(comments));

					case 4:
					case 'end':
						return _context3.stop();
				}
			}
		}, _callee3, _this$1);
	}));

	return function (_x5, _x6) {
		return _ref3.apply(this, arguments);
	};
}());
// Add Comment
router$1.post('/comments', function () {
	var _ref4 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee4(req, res) {
		var data;
		return _regeneratorRuntime.wrap(function _callee4$(_context4) {
			while (1) {
				switch (_context4.prev = _context4.next) {
					case 0:
						_context4.prev = 0;
						data = req.body;

						new Comment(data).save();
						return _context4.abrupt('return', res.json('ok'));

					case 6:
						_context4.prev = 6;
						_context4.t0 = _context4['catch'](0);
						return _context4.abrupt('return', res.status(500).json({ success: false, msg: 'Server error:' }));

					case 9:
					case 'end':
						return _context4.stop();
				}
			}
		}, _callee4, _this$1, [[0, 6]]);
	}));

	return function (_x7, _x8) {
		return _ref4.apply(this, arguments);
	};
}());

// Show toppings List
router$1.get('/toppings', function () {
	var _ref5 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee5(req, res) {
		var toppings;
		return _regeneratorRuntime.wrap(function _callee5$(_context5) {
			while (1) {
				switch (_context5.prev = _context5.next) {
					case 0:
						_context5.next = 2;
						return Topping.find();

					case 2:
						toppings = _context5.sent;
						return _context5.abrupt('return', res.json(toppings));

					case 4:
					case 'end':
						return _context5.stop();
				}
			}
		}, _callee5, _this$1);
	}));

	return function (_x9, _x10) {
		return _ref5.apply(this, arguments);
	};
}());
// Add Topping
router$1.post('/toppings', function () {
	var _ref6 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee6(req, res) {
		var data;
		return _regeneratorRuntime.wrap(function _callee6$(_context6) {
			while (1) {
				switch (_context6.prev = _context6.next) {
					case 0:
						_context6.prev = 0;
						data = req.body;

						new Topping(data).save();
						return _context6.abrupt('return', res.json('ok'));

					case 6:
						_context6.prev = 6;
						_context6.t0 = _context6['catch'](0);
						return _context6.abrupt('return', res.status(500).json({ success: false, msg: 'Server error:' }));

					case 9:
					case 'end':
						return _context6.stop();
				}
			}
		}, _callee6, _this$1, [[0, 6]]);
	}));

	return function (_x11, _x12) {
		return _ref6.apply(this, arguments);
	};
}());

// Show locations List
router$1.get('/locations', function () {
	var _ref7 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee7(req, res) {
		var locations;
		return _regeneratorRuntime.wrap(function _callee7$(_context7) {
			while (1) {
				switch (_context7.prev = _context7.next) {
					case 0:
						_context7.next = 2;
						return Location.find();

					case 2:
						locations = _context7.sent;
						return _context7.abrupt('return', res.json(locations));

					case 4:
					case 'end':
						return _context7.stop();
				}
			}
		}, _callee7, _this$1);
	}));

	return function (_x13, _x14) {
		return _ref7.apply(this, arguments);
	};
}());
// Add Location
router$1.post('/locations', function () {
	var _ref8 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee8(req, res) {
		var data;
		return _regeneratorRuntime.wrap(function _callee8$(_context8) {
			while (1) {
				switch (_context8.prev = _context8.next) {
					case 0:
						_context8.prev = 0;
						data = req.body;

						new Location(data).save();
						return _context8.abrupt('return', res.json('ok'));

					case 6:
						_context8.prev = 6;
						_context8.t0 = _context8['catch'](0);
						return _context8.abrupt('return', res.status(500).json({ success: false, msg: 'Server error:' }));

					case 9:
					case 'end':
						return _context8.stop();
				}
			}
		}, _callee8, _this$1, [[0, 6]]);
	}));

	return function (_x15, _x16) {
		return _ref8.apply(this, arguments);
	};
}());

// Default
router$1.get('/:dishId?/:selection?', function () {
	var _ref9 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee9(req, res) {
		var dishId, selection, arr, dishes, re, dish, likes, comments;
		return _regeneratorRuntime.wrap(function _callee9$(_context9) {
			while (1) {
				switch (_context9.prev = _context9.next) {
					case 0:
						dishId = req.params.dishId;
						selection = req.params.selection;
						arr = ['likes', 'comments', 'toppings', 'locations', 'composition'];

						if (!(!dishId && !selection)) {
							_context9.next = 8;
							break;
						}

						_context9.next = 6;
						return Dish.find();

					case 6:
						dishes = _context9.sent;
						return _context9.abrupt('return', res.json(dishes));

					case 8:
						re = new RegExp('(^[0-9a-fA-F]{24}$)');

						if (dishId.match(re)) {
							_context9.next = 11;
							break;
						}

						return _context9.abrupt('return', res.status(400).json({ success: false, msg: 'Incorrect userId' }));

					case 11:
						_context9.next = 13;
						return Dish.findOne({ _id: dishId });

					case 13:
						dish = _context9.sent;

						if (!(dishId && !selection)) {
							_context9.next = 18;
							break;
						}

						if (dish) {
							_context9.next = 17;
							break;
						}

						return _context9.abrupt('return', res.status(404).json({ succuss: false, msg: 'Dish not found' }));

					case 17:
						return _context9.abrupt('return', res.json(dish));

					case 18:
						if (!(arr.indexOf('' + selection) != -1)) {
							_context9.next = 40;
							break;
						}

						_context9.t0 = selection;
						_context9.next = _context9.t0 === 'likes' ? 22 : _context9.t0 === 'comments' ? 27 : _context9.t0 === 'toppings' ? 32 : _context9.t0 === 'locations' ? 34 : _context9.t0 === 'composition' ? 36 : 38;
						break;

					case 22:
						_context9.next = 24;
						return Like.find({ dish: dish._id });

					case 24:
						likes = _context9.sent;
						return _context9.abrupt('return', res.json(likes));

					case 27:
						_context9.next = 29;
						return Comment.find({ dish: dish._id });

					case 29:
						comments = _context9.sent;
						return _context9.abrupt('return', res.json(comments));

					case 32:
						return _context9.abrupt('return', res.json(dish.toppings));

					case 34:
						return _context9.abrupt('return', res.json(dish.locations));

					case 36:
						return _context9.abrupt('return', res.json(dish.composition));

					case 38:
						_context9.next = 41;
						break;

					case 40:
						return _context9.abrupt('return', res.status(400).json({ success: false, msg: 'Bad Request' }));

					case 41:
					case 'end':
						return _context9.stop();
				}
			}
		}, _callee9, _this$1);
	}));

	return function (_x17, _x18) {
		return _ref9.apply(this, arguments);
	};
}());

// Add Product
router$1.post('', function () {
	var _ref10 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee10(req, res) {
		var data, dish;
		return _regeneratorRuntime.wrap(function _callee10$(_context10) {
			while (1) {
				switch (_context10.prev = _context10.next) {
					case 0:
						data = req.body;

						// if dish.name will primary
						/*const dishName = await Dish.findOne({name: data.dish.name});
      if (dishName) return res.json({success: false, msg: 'Dish already exist'});*/

						// can use addDish function:
						/*try {
      	const result = await addDish(data);
      	return res.json(result);
      } catch(err) {
      	return res.status(500).json(err);
      }*/

						_context10.prev = 1;
						dish = new Dish(data.dish);
						_context10.next = 5;
						return dish.save();

					case 5:
						return _context10.abrupt('return', res.json(dish));

					case 8:
						_context10.prev = 8;
						_context10.t0 = _context10['catch'](1);
						throw _context10.t0;

					case 11:
					case 'end':
						return _context10.stop();
				}
			}
		}, _callee10, _this$1, [[1, 8]]);
	}));

	return function (_x19, _x20) {
		return _ref10.apply(this, arguments);
	};
}());



/*const data = req.body;
let newComment = new Comment(data);

try {
	const comment = await newComment.save();
	return res.json(comment);
} catch(err) {
	res.status(500).json('err');
}*/

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
												return User$1.findOne({ phone: jwt_payload.phone });

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
	console.log('connected to database' + config.database);
});
// On Error
mongoose__default.connection.on('error', function (err) {
	console.log('database error' + err);
});

app.use('/users', router);
app.use('/dishes', router$1);

app.get('/', function (req, res) {
	res.send('dratuti');
});

app.listen(port, function () {
	console.log('yep' + port);
});
//# sourceMappingURL=index.js.map
