import express from 'express';
import passport from 'passport';
import access from '../middleware/access';
import checkId from '../middleware/checkId';

export default class defaultRoutes {
	constructor() {
		this.router = express.Router();
	}

	init(model, modelName) {
		this.initGet(model, modelName);
		this.initPost(model, modelName);
		this.initChange(model, modelName);
		this.initDelete(model, modelName);
	}
	
	initGet(model, modelName) {
		this.router.get('/:id?/:select?', passport.authenticate('jwt', {session: false}), access, async(req, res) => {
			const id = req.params.id;
			const select = req.params.select;

			if (!id && !select) {
				let modifiedSince = req.headers['if-modified-since'];
				if (modifiedSince) {
					try {
						modifiedSince = new Date(Date.parse(modifiedSince));
						let news = await model.find({"updatedAt": {$gt: modifiedSince}});
						if (news[0]) {
							let lastModified = news.reduce(function(prev, candidate) {
								return (prev.updatedAt > candidate.updatedAt) ? prev : candidate;
							});
							lastModified = Date.parse(lastModified.updatedAt);
							const opts = {
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
							lastModified = (new Date(lastModified)).toLocaleString('en-US', opts);
							res.set('Last-Modified', lastModified);
							return res.json(news);
						} else {
							return res.status(304).send();
						}
					} catch(err) {
						next(err);	
					}	
				} else {
					if (req.user.phone) {
						return res.json(await model.find({userId: req.user._id}));
					}
					return res.json(await model.find());
				}
			}

			const re = new RegExp('(^[0-9a-fA-F]{24}$)');
			if (!id.match(re)) {
				return res.status(400).json({success: false, msg: `Incorrect ${modelName} id`})
			}

			if (id && !select) {
				try {
					const elem = await model.findById(id);
					if (!elem) return res.status(404).json({success: false, msg: `${modelName} not found`})
					return res.json(elem);
				} catch(err) {
					next(err);
				}
			}

			try {
				const elem = await model.findById(id);
				if (!elem[`${select}`]) return res.json({success: false, msg: `Cannot select ${select}`});
				return res.json(elem[`${select}`]);
			} catch(err) {
				next(err);
			}
		})
	}

	initPost(model, modelName) {
		this.router.post('', passport.authenticate('jwt', {session: false}), access, async(req, res) => {
			try {
				/*if (['orders', 'likes', 'comments'].indexOf(modelName) != -1) {
					var elem = new model(Object.assign({}, req.body, {userId: req.user.id}));
				} else {
					var elem = new model(req.body);
				}*/

				const elem = new model(req.body);
				await elem.save();
				return res.status(201).json(elem);
			} catch(err) {
				next(err);
			}
		})
	}

	initChange(model, modelNmae) {
		this.router.post('/:id', checkId, passport.authenticate('jwt', {session: false}), access, async(req, res) => {
			try {
				const id = req.params.id;
				const elem = await model.findById(id);
				if (!elem) return res.status(404).json({success:false, msg: `${modelName} not found`});
				await model.update({_id: id}, {$set:
					req.body
				});
				return res.json({success: true, msg: `${modelName} updated`});
			} catch(err) {
				next(err);
			}
		})
	}

	initDelete(model, modelName) {
		this.router.delete('/:id', passport.authenticate('jwt', {session: false}), access, async(req, res) => {
			const id = req.params.id;
			try {
				const elem = await model.findById(id);
				if (!elem) return res.status(404).json({success:false, msg: `${modelName} not found`});
				await elem.remove();
				return res.json({success: true, msg: `${modelName} deleted`});
			} catch(err) {
				next(err);
			}
		})
	}
}

