
/**
 * Module dependencies.
 */
var util = require('util');
var express = require('express');
var http = require('http');
var mongoose = require('mongoose');
var private_config = require('./private_config');
var EventEmitter = require('events').EventEmitter;


mongoose.set('debug', true);

mongoose.connect("mongodb://giombu:giombu@oceanic.mongohq.com:10021/giombu", function(err){
	if(err) throw err;
	var app = express();
	var server =  server = require('http').createServer(app);
	var io = require('socket.io').listen(server);

	require('./middleware')(app, io);
	util.inherits(app, EventEmitter);
	require('./routes')(app);

	server.listen(app.get('port'), function(){
	  console.log('Express server listening on port ' + app.get('port'));
	});
});
