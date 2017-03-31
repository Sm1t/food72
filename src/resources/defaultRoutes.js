import express from 'express';

export default class defaultRoutes {
	constructor() {
		this.router = express.Router();
	}
	
	init(model, modelName) {
		this.router.get('/:id?/:select?', async(req, res) => {
			const id = req.params.id;
			const select = req.params.select;

			if (!id && !select) return res.json(await model.find());

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

