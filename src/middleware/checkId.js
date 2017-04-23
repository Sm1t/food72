export default (req, res, next) => {
	const id = req.params.id;
	const re = new RegExp('(^[0-9a-fA-F]{24}$)');
	if (!id.match(re)) {
		return res.status(400).json({success: false, msg: `Incorrect ${modelName} id`});
	}
	return next();
}