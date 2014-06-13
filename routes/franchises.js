var FranchiseModel = require('../models/franchise').FranchiseModel;
var FranchisorModel = require('../models/franchisor').FranchisorModel;
module.exports = function(app){


	app.get('/franchises/initialize', function(req, res){
		FranchiseModel.remove(function(err){
			if (err) throw err;

			FranchisorModel.findOne({"cctdl":"ar"}).exec(function(err,franchisor){
				console.log(franchisor.length)

				FranchisorModel.find().exec(function(err,franchisor){
					console.log(franchisor.length)
				})
				FranchiseModel.remove({});
				var franchise = new FranchiseModel();
				franchise.name = 'Parana'
				franchise.slug = "parana"
				franchise.franchisor = franchisor._id
				franchise.save(function(err){
					if(!err){
						console.log(franchise);
					} else {
						console.log("Error: - " + err);
					}
				}); 
				var franchise = new FranchiseModel();
				franchise.name = 'Rosario'
				franchise.slug = "rosario"
				franchise.franchisor = franchisor._id
				franchise.is_default = true
				franchise.save(function(err){
					if(!err){
						console.log(franchise);
					} else {
						console.log("Error: - " + err);
					}
				}); 
				var franchise = new FranchiseModel();
				franchise.name = 'Buenos Aires'
				franchise.slug = "buenosaires"
				franchise.franchisor = franchisor._id
				franchise.save(function(err){
					if(!err){
						console.log(franchise);
					} else {
						console.log("Error: - " + err);
					}
				}); 
				var franchise = new FranchiseModel();
				franchise.name = 'Santa Fe'
				franchise.slug = "santafe"
				franchise.franchisor = franchisor._id
				franchise.save(function(err){
					if(!err){
						console.log(franchise);
					} else {
						console.log("Error: - " + err);
					}
				}); 

			})
		});

			
	});


	app.get('/franchises', function(req, res, next){
		FranchiseModel.find().sort("-name").exec( function(err, franchises){
			if (err) throw err;
			res.json(franchises);
		});
	});
	
	app.get('/franchises/:id:format(.json)?', function(req, res, next){
		FranchiseModel.find({ franchisor : req.params.id}).sort("-name").exec( function(err, franchises){
			if (err) throw err;
			res.json(franchises);
		});
	});
}