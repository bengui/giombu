var users = require('./users');
var promoters = require('./promoters');
var levels = require('./levels');
var deals = require('./deals');
var stores = require('./stores');
var franchisors = require('./franchisors');
var franchises = require('./franchises');
var currencies = require('./currencies');
var countries = require('./countries');
var cities = require('./cities');
var states = require('./states');
var images = require('./images');
var states = require('./states');
var cities = require('./cities');
var sellers = require('./sellers');
var subscribers = require('./subscribers');
var invitations = require('./invitations');
var questions = require('./questions');
var payments = require('./payments');
var sales = require('./sales');
var commissions = require('./commissions');
var news = require('./news');
var newsletters = require('./newsletters');


var errors = require('./errors');

module.exports = function(app){

	//Root
	/*app.get('/', function(req, res){

		console.log('session');
		console.log(req.session);

		res.render('index', { title: 'Giombu' });
	});*/

	users(app);
	promoters(app);
	levels(app);
	franchisors(app);
	franchises(app);
	currencies(app);
	countries(app);
	deals(app);
	stores(app);
	images(app);
	states(app);
	cities(app);
	sellers(app);
	subscribers(app);
	invitations(app);
	questions(app);
	payments(app);
	sales(app);
	commissions(app);
	news(app);
	newsletters(app);
	// error handlers
	errors(app);

	//DEBUG!
	require('./debug')(app);

}


