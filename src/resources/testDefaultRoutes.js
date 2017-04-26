import express from 'express';
import access from '../middleware/access';
import checkId from '../middleware/checkId';
import ifModifiedSince from '../resources/ifModifiedSince';
import getLastModified from '../resources/getLastModified';

export default class defaultRoutes {
	constructor(params) {
		Object.assign(this, params);
		this.router = express.Router();
	}

	init(model, modelName) {
		this.initGet(model, modelName);
		this.initPost(model, modelName);
		this.initPut(model, modelName);
		this.initDelete(model, modelName);
	}
	
	initGet(model, modelName) {
		this.router.get('/:id?/:select?', checkId, this.getMiddlewares || [], async(req, res, next) => {
			const id = req.params.id;
			const select = req.params.select;

			if (!id && !select) {
				let modifiedSince = req.headers['if-modified-since'];
				if (modifiedSince) {
					try {
						const changes = await ifModifiedSince(model, modifiedSince);
						if (changes) {
							res.set('Last-Modified', changes.lastModified);
							return res.json(changes.news);
						} else {
							return res.status(304).send();
						}
					} catch(err) {
						next(err);	
					}	
				} else {
					if (req.user && req.user.phone) {
						return res.json(await model.find({userId: req.user._id}));
					}
					const lastModified = await getLastModified(model);
					res.set('Last-Modified', lastModified);
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
		this.router.post('', this.postMiddlewares || [], async(req, res, next) => {
			try {
				const exist = await model.findOne(req.body);
				if (exist) {
					return res.status(400).json({success: false, msg: `${modelName} aready exist`});
				}
				const elem = new model(req.body);
				await elem.save();
				return res.status(201).json(elem);
			} catch(err) {
				next(err);
			}
		})
	}

	initPut(model, modelName) {
		this.router.put('/:id', checkId, this.putMiddlewares || [], async(req, res, next) => {
			const id = req.params.id;

			try {
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
		this.router.delete('/:id', checkId, this.deleteMiddlewares || [], async(req, res, next) => {
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

