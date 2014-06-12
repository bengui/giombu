var FranchisorModel = require('../models/franchisor').FranchisorModel;
var CurrencyModel = require('../models/currency').CurrencyModel;
var CountryModel = require('../models/country').CountryModel;

module.exports = function(app){


	app.get('/franchisors/initialize', function(req, res){

		CurrencyModel.findOne().exec(function(err,currency){

			FranchisorModel.remove().exec(function(err,franchisor){

				CountryModel.findOne({ name : 'Argentina'}, function(err, country){
					
					var franchisor = new FranchisorModel();
					
					franchisor.name = 'Argentina';
					franchisor.cctdl = "ar";
					franchisor.default_timezone = -3;
					franchisor.currency =currency._id;
					franchisor.country = country._id;

					franchisor.save(function(err){
						if(!err){
							console.log(franchisor);
						} else {
							console.log("Error: - " + err);
						}
					}); 

				});

				CountryModel.findOne({ name : 'Mexico'}, function(err, country){
					
					var franchisor = new FranchisorModel();
					franchisor.name = 'Mexico';
					franchisor.cctdl = "mx";
					franchisor.default_timezone = -6;
					franchisor.country = country._id;

					franchisor.save(function(err){
						if(!err){
							console.log(franchisor);
						} else {
							console.log("Error: - " + err);
						}
					}); 
				});

				CountryModel.findOne({ name : 'Puerto Rico'}, function(err, country){
					
					var franchisor = new FranchisorModel();

					franchisor.name = 'Puerto Rico';
					franchisor.cctdl = "pr";
					franchisor.default_timezone = -4;
					franchisor.country = country._id;

					franchisor.save(function(err){
						if(!err){
							console.log(franchisor);
						} else {
							console.log("Error: - " + err);
						}
					}); 
				});
			})
		});
	});

	app.get('/franchisors', function(req, res, next){
		FranchisorModel.find().sort("-name").exec( function(err, franchisors){
			if (err) throw err;
			res.json(franchisors);
		});
	});
	app.get('/franchisors/:id:format(.json)?', function(req, res, next){
		FranchisorModel.find({ country : req.params.id}).sort("-name").exec( function(err, franchisors){
			if (err) throw err;
			res.json(franchisors);
		});
	});

	


}