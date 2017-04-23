export default (req, res, next) => {
	const userAccess = ['/likes', '/comments', '/orders'];
	const employeeAccess = ['/dishes', '/toppings', '/locations', '/menu'];
	const adminAccess = ['/employees'];

	if (req.user) {
		if (adminAccess.indexOf(req.originalUrl) != -1) {
			if (req.user.role === 'admin') return next();
			return res.status(403).json({success: false, msg: 'Access denied'});
		}

		if (employeeAccess.indexOf(req.originalUrl) != -1) {
			if (req.user.login) return next();
			return res.status(403).json({success: false, msg: 'Access denied'});;
		}

		if (userAccess.indexOf(req.originalUrl) != -1) {
			if (req.user.phone) return next();
			return res.status(401).json({success: false, msg: 'Unauthorized'});;
		}
	}

	return res.status(403).json({success: false, msg: 'Access denied'});
}