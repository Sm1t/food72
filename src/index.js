import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Promise from 'bluebird';
import path from 'path';
import passport from 'passport';
import fs from 'fs';
import config from './config/index';
import Passport from './config/passport';
import users from './routes/users';
import dishes from './routes/dishes';
import locations from './routes/locations';
import likes from './routes/likes';
import comments from './routes/comments';
import toppings from './routes/toppings';
import orders from './routes/orders';
import employees from './routes/employees';
import Topping from './models/topping';
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();



const app = express();
var bodyParser = require('body-parser');
Passport(passport);

app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public'))); 
app.use('/static', express.static(path.join(__dirname, 'jenya')));
const port = 3000;

//app.disable('x-powered-by');

mongoose.Promise = Promise;
// Connect to Database
mongoose.connect(config.database);
// On connection
mongoose.connection.on('connected', () => {
	console.log('connected to database ' + config.database);
});
// On Error
mongoose.connection.on('error', (err) => {
	console.log('database error' + err);
});

app.get('/', (req, res) => {
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

app.use((req, res, next) => {
	return res.status(404).json({msg: '404 Not Found'});
})

app.use((err, req, res, next) => {
	console.log(err);
	return res.status(500).json({success: false, msg: err.name});
})



app.listen(port, () => {
	console.log('yep' + port);
})