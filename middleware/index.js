var path = require('path');
var express = require('express');
var SessionSockets = require('session.socket.io');
var sessionSockets;
var private_config = require('../private_config');
var mailer = require('express-mailer');

module.exports = function(app, io){

	var secret_sauce = 'this_is_my_secret_sauce';
	var sessionStore = new express.session.MemoryStore();
	var cookieParser = express.cookieParser(secret_sauce);

	// all environments
	app.set('port', process.env.PORT || 3000);
	app.set('views', path.join(__dirname, '../views'));
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.json());
	app.use(express.urlencoded());
	app.use(express.methodOverride());
	app.use(express.static(path.join(__dirname, '../public')));
	app.set('photos',path.join(__dirname,'../public/photos/'));
	app.use(cookieParser);
	app.use(express.session({
		store :  sessionStore 
	}));
	app.use(express.bodyParser());
	// expose session to views
	app.use(function (req, res, next) {
		if(typeof req.session.expose === 'undefined'){
			req.session.expose = {};
		}

		if(req.session.expose.message){
			delete req.session.expose.message;
		}
		if(req.session.message){
			req.session.expose.message = req.session.message;
			delete req.session.message;	
		}
		if(req.session.expose.error){
			delete req.session.expose.error;
		}
		if(req.session.error){
			req.session.expose.error = req.session.error;
			delete req.session.error;	
		}


		res.locals.expose = req.session.expose;
		next();
	});

	// development only
	if ('development' == app.get('env')) {
		app.use(express.errorHandler());
	}

	mailer.extend(app, {
		from: private_config.mail_user,
		host: 'smtp.gmail.com', // hostname
		secureConnection: true, // use SSL
		port: 465, // port for secure SMTP
		transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
		auth: {
			user: private_config.mail_user,
			pass:  private_config.mail_password,
		}
	});


	//Socket IO
	var socket = require('../socket');
	socket.setIO(io);

	sessionSockets = new SessionSockets(io, sessionStore, cookieParser);
	sessionSockets.on('connection', socket.handleSocketCalls);
	
}
