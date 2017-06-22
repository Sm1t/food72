import path from 'path';
import fs from 'fs';
import testDefaultRoutes from '../resources/testDefaultRoutes';
import Qr from '../models/qr';
import multipart from 'connect-multiparty'
var multipartMiddleware = multipart();


const defaultQrs = new testDefaultRoutes();
defaultQrs.initPost(Qr, 'qr');

defaultQrs.router.post('/pictures', multipartMiddleware, async(req, res, next) => {
	console.log(req.headers['id']);
	const img = req.files.picture;
	try {
		fs.readFile(img.path, (err, data) => {
			if (err) return res.send(err);
			const way = path.resolve(__dirname, '../uploads/pictures') + '/' + img.originalFilename;
			fs.writeFile(way, data, async(err) => {
				if (err) return res.send(err);
				const link = 'http://arusremservis.ru/qrs/pictures/' + img.originalFilename;
				await Qr.findOneAndUpdate({_id: req.headers['id']}, {$set: {
					picture: link
				}});
				res.json({success: true, link: link});
			})
		})
	} catch(err) {
		return res.status(500).send(err);
	}
})

defaultQrs.router.get('/pictures/:img', async(req, res) => {
	try {
		res.sendFile(path.resolve(__dirname, '../uploads/pictures') + '/' + req.params.img);
	} catch(err) {
		res.send(err);
	}
})

export default defaultQrs.router;