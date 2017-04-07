import express from 'express';
import Trace from '../models/trace';

export default class defaultRoutes {
	constructor() {
		this.router = express.Router();
	}
	
	init(model, modelName) {
		this.router.get('/:id?/:select?', async(req, res) => {
			const id = req.params.id;
			const select = req.params.select;

			if (!id && !select) {
				let modifiedSince = req.headers['if-modified-since'];
				if (modifiedSince) {
					/*if (modifiedSince === "1970-01-01T00:00:00.000Z") {
						const compare = true
					} else {
						const compare = false
					}*/
					const compare = (modifiedSince === "1970-01-01T00:00:00.000Z");
					const result = Object.assign({}, req.headers, {compare: compare});
					await (new Trace({headers: result})).save();
					try {
						let news = await model.find({"updatedAt": {$gt: modifiedSince}});
						if (news[0]) {
							let lastModified = news.reduce(function(prev, candidate) {
								return (prev.updatedAt > candidate.updatedAt) ? prev : candidate;
							});
							res.header({'Last-Modified': JSON.stringify(lastModified.updatedAt)});
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

		this.router.post('/:id?', async(req, res) => {
			const id = req.params.id;

			if (!id) {
				try {
					const elem = new model(req.body);
					await elem.save();
					return res.status(201).json(elem);
				} catch(err) {
					console.log(err);
					return res.status(500).json({success: false, msg: err.name});
				}
			}

			const re = new RegExp('(^[0-9a-fA-F]{24}$)');
			if (!id.match(re)) {
				return res.status(400).json({success: false, msg: `Incorrect ${modelName} id`});
			}

			try {
				const elem = await model.findById(id);
				if (!elem) return res.status(404).json({success:false, msg: `${modelName} not found`});

				if (req.body.delete) {
					await elem.remove();
					return res.json({success: true, msg: `${modelName} deleted`});
				}

				await model.update({_id: id}, {$set:
					req.body
				});
				return res.json({success: true, msg: `${modelName} updated`});
			} catch(err) {
				return res.status(500).json({success: false, msg: err.name});
			}
		})
	}
}

