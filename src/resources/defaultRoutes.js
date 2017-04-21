import express from 'express';
import passport from 'passport';
import access from '../middleware/access';

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
		this.router.get('/:id?/:select?', async(req, res) => {
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
						console.log(err);
						return res.status(500).json({success: false, msg: err.name});	
					}	
				} else {
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
					return res.status(500).json({success: false, msg: err.name});
				}
			}

			try {
				const elem = await model.findById(id);
				if (!elem[`${select}`]) return res.json({success: false, msg: `Cannot select ${select}`});
				return res.json(elem[`${select}`]);
			} catch(err) {
				return res.status(500).json({success: false, msg: err.name});
			}
		})
	}

	initPost(model, modelName) {
		this.router.post('', passport.authenticate('jwt', {session: false}), access, async(req, res) => {
			const id = req.params.id;
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
				console.log(err);
				return res.status(500).json({success: false, msg: err.name});	
			}
		})
	}

	initChange(model, modelNmae) {
		this.router.post('/:id', passport.authenticate('jwt', {session: false}), access, async(req, res) => {
			const id = req.params.id;
			const re = new RegExp('(^[0-9a-fA-F]{24}$)');
			if (!id.match(re)) {
				return res.status(400).json({success: false, msg: `Incorrect ${modelName} id`});
			}

			try {
				const elem = await model.findById(id);
				if (!elem) return res.status(404).json({success:false, msg: `${modelName} not found`});
				await model.update({_id: id}, {$set:
					req.body
				});
				return res.json({success: true, msg: `${modelName} updated`});
			} catch(err) {
				return res.status(500).json({success: false, msg: err.name});
			}
		})
	}

	initDelete(model, modelName) {
		this.router.post('/:id', passport.authenticate('jwt', {session: false}), access, async(req, res) => {
			const id = req.params.id;
			const re = new RegExp('(^[0-9a-fA-F]{24}$)');
			if (!id.match(re)) {
				return res.status(400).json({success: false, msg: `Incorrect ${modelName} id`});
			}

			try {
				const elem = await model.findById(id);
				if (!elem) return res.status(404).json({success:false, msg: `${modelName} not found`});
				await elem.remove();
				return res.json({success: true, msg: `${modelName} deleted`});
			} catch(err) {
				return res.status(500).json({success: false, msg: err.name});
			}
		})
	}
}

