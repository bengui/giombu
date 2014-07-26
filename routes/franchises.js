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

	app.get('/franchises/change_franchise/:slug',function (req, res,  next){
		FranchiseModel.findOne({"slug": req.params.slug}).exec(function(err, franchise){
			req.session.user = req.session.user || new Object();
			req.session.user.selected_franchise = franchise;
			res.redirect('/');
		});
	});

	app.post('/franchises', function(req, res, next){
		franchisor = '53554009974bf07454b08ed8'
		if(typeof req.session.user !== "undefined"){
			if(typeof req.session.user.franchisor !== "undefined"){
				if(req.session.user.franchisor.length>0){
					franchisor = req.session.user.franchisor[0]._id
				}
			}
		}
		FranchiseModel.find({'franchisor':franchisor}).sort("-name").exec( function(err, franchises){
			if (err) throw err;
			res.json(franchises);
		});
	});

	app.get('/franchises', function(req, res, next){
		FranchiseModel.find({'franchisor':franchisor}).sort("-name").exec( function(err, franchises){
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