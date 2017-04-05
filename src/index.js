import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Promise from 'bluebird';
import path from 'path';
import passport from 'passport';
import config from './config/index';
import Passport from './config/passport';
import users from './routes/users';
import dishes from './routes/dishes';
import locations from './routes/locations';
import likes from './routes/likes';
import comments from './routes/comments';
import toppings from './routes/toppings';
import orders from './routes/orders';



const app = express();
var bodyParser = require('body-parser');
Passport(passport);

app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public'))); 
const port = 3000;


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


app.use('/users', users);
app.use('/dishes', dishes);
app.use('/locations', locations);
app.use('/likes', likes);
app.use('/comments', comments);
app.use('/toppings', toppings);
app.use('/orders', orders);


app.get('/', (req, res) => {
	res.send('dratuti');
})

app.listen(port, () => {
	console.log('yep' + port);
})