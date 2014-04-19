var path = require('path');
var express = require('express');
var partials = require('express-partials')
module.exports = function(app){


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
	app.use(express.cookieParser());
	app.use(express.session({ secret: 'giombu-giombu-secret' }));
	app.use(express.bodyParser());
	app.use(partials());
	// expose session to views
	app.use(function (req, res, next) {
		if(typeof req.session.expose === 'undefined'){
			req.session.expose = {};
		}
		res.locals.expose = req.session.expose;
		next();
	});


	// development only
	if ('development' == app.get('env')) {
		app.use(express.errorHandler());
	}

}
