var Mailer = require('../helpers/mailer');
var NewsletterModel = require('../models/newsletter').NewsletterModel;
var SubscriberModel = require('../models/subscriber').SubscriberModel;
var FranchiseModel = require('../models/franchise').FranchiseModel;
var DealModel = require('../models/deal').DealModel;
var mailer = require('express-mailer');



module.exports = function (app){
	//
	app.get('/newsletters/sendTest/:id', function(req, res, next){
		FranchiseModel.find({ _id : req.params.id}).exec( function(err, franchise){
			if(err) throw err;
			if(franchise){
			  	DealModel.find( /*{"franchises": {$in: [req.body.id]}}*/ ).sort("-created").populate('franchises').populate("images").exec(function(err, deals){
					if(err) throw err;
					if(deals.length > 0){
						for (var i = deals.length - 1; i >= 0; i--) {
							deals_newsletter.push(deals[i]._id);
						};
						app.mailer.send('newsletters/default_template', {
					  		to: 'narc88@gmail.com',
					  		subject: 'Newsletter '+franchise.name, 
					  		deals: deals,
					  		franchise: franchise,
					  		host: "http://localhost:3000"
							}, function (err) {
						    	if (err) {
							      	console.log(err);
							      	res.send('There was an error sending the email');
							      	return;
							    }
							    newsletter = new NewsletterModel();
							    newsletter.franchise = 
							    newsletter.deals = deals_newsletter;
							    newsletter.title = 'Newsletter '+franchise.name;
							    newsletter.description = 'Newsletter para la franquicia'+ franchise.name;
							    newsletter.save(function(){
							    	res.redirect('/newsletters/'+newsletter.id)
							    });
							    
							});
					}
			  	});
			}
		});
	});
										
	app.get('/newsletters/test/:id', function (req, res, next) {
		FranchiseModel.find({ _id : req.params.id}).exec( function(err, franchise){
			if(err) throw err;
			if(franchise){
				DealModel.find( /*{"franchises": {$in: [req.body.id]}}*/  ).sort("-created").populate('franchises').populate("images").exec(function(err, deals){
					if(err) throw err;
					if(deals.length > 0){
						app.mailer.render('newsletters/default_template', {
							to: 'narc88@gmail.com',
							subject: 'Newsletter '+franchise.name,
							deals: deals,
							franchise: franchise,
							host: "http://localhost:3000"
						}, function (err, message) {
							if (err) {
						    	console.log(err);
						    	res.send('There was an error rendering the email');
						    	return;
						    }
						    res.header('Content-Type', 'text/plain');
						    res.send(message);
						});
					}
				});
			}
		});
	});
}