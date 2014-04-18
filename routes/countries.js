var CountryModel = require('../models/country').CountryModel;
var CurrencyModel = require('../models/currency').CurrencyModel;
var StateModel = require('../models/state').StateModel;
var CityModel = require('../models/city').CityModel;
module.exports = function(app){
	app.get('/countries/initialize', function(req, res){
		CurrencyModel.findOne().exec(function(err,currency){
			CountryModel.remove().exec(function(err,country){
				console.log(country.length)

				CountryModel.find().exec(function(err,country){
					console.log(country.length)
				})
				CountryModel.remove({});
				var country = new CountryModel();
				country.name = 'Argentina'
				country.save(function(err){
					if(!err){
						console.log(country);
						CountryModel.findOne({"name":"Argentina"}).exec(function(err,country){
						var state = new StateModel();
						state.name = 'Entre Rios'
						state.country = country._id
						state.save(function(err){
							if(!err){
								console.log(state);

								var city = new CityModel({
									name 	: 'Parana',
									state 	: state._id
								});

								city.save(function(err){
									if (err) throw err;
								});

							} else {
								console.log("Error: - " + err);
							}
						});
						var state = new StateModel();
						state.name = 'Santa Fe'
						state.country = country._id
						state.save(function(err){
							if(!err){
								console.log(state);

								var city = new CityModel({
									name 	: 'Rosario',
									state 	: state._id
								});

								city.save(function(err){
									if (err) throw err;
								});

								var city = new CityModel({
									name 	: 'Santa Fe',
									state 	: state._id
								});

								city.save(function(err){
									if (err) throw err;
								});


							} else {
								console.log("Error: - " + err);
							}
						}); 
						var state = new StateModel();
						state.name = 'Buenos Aires'
						state.country = country._id
						state.save(function(err){
							if(!err){
								console.log(state);

								var city = new CityModel({
									name 	: 'Buenos Aires',
									state 	: state._id
								});

								city.save(function(err){
									if (err) throw err;
								});

								var city = new CityModel({
									name 	: 'Pergamino',
									state 	: state._id
								});

								city.save(function(err){
									if (err) throw err;
								});

								var city = new CityModel({
									name 	: 'La Plata',
									state 	: state._id
								});

								city.save(function(err){
									if (err) throw err;
								});


							} else {
								console.log("Error: - " + err);
							}
						}); 
						var state = new StateModel();
						state.name = 'Cordoba'
						state.country = country._id
						state.save(function(err){
							if(!err){
								console.log(state);


								var city = new CityModel({
									name 	: 'Cordoba',
									state 	: state._id
								});

								city.save(function(err){
									if (err) throw err;
								});

							} else {
								console.log("Error: - " + err);
							}
						}); 
						var state = new StateModel();
						state.name = 'Mendoza'
						state.country = country._id
						state.save(function(err){
							if(!err){
								console.log(state);

								var city = new CityModel({
									name 	: 'Mendoza',
									state 	: state._id
								});

								city.save(function(err){
									if (err) throw err;
								});

							} else {
								console.log("Error: - " + err);
							}
						}); 
						var state = new StateModel();
						state.name = 'Corrientes'
						state.country = country._id
						state.save(function(err){
							if(!err){
								console.log(state);

								var city = new CityModel({
									name 	: 'Corrientes',
									state 	: state._id
								});

								city.save(function(err){
									if (err) throw err;
								});

							} else {
								console.log("Error: - " + err);
							}
						});  
					})
					} else {
						console.log("Error: - " + err);
					}
				}); 
				
				var country = new CountryModel();
				country.name = 'Mexico'
				country.save(function(err){
					if(!err){
						console.log(country);
						CountryModel.findOne({"name":"Mexico"}).exec(function(err,country){
							var state = new StateModel();
							state.name = 'Df'
							state.country = country._id
							state.save(function(err){
								if(!err){
									console.log(state);
								} else {
									console.log("Error: - " + err);
								}
							});
							var state = new StateModel();
							state.name = 'Guadalajara'
							state.country = country._id
							state.save(function(err){
								if(!err){
									console.log(state);
								} else {
									console.log("Error: - " + err);
								}
							}); 
							var state = new StateModel();
							state.name = 'Morelia'
							state.country = country._id
							state.save(function(err){
								if(!err){
									console.log(state);
								} else {
									console.log("Error: - " + err);
								}
							}); 
							var state = new StateModel();
							state.name = 'Acapulco'
							state.country = country._id
							state.save(function(err){
								if(!err){
									console.log(state);
								} else {
									console.log("Error: - " + err);
								}
							}); 
						})
					} else {
						console.log("Error: - " + err);
					}
				}); 
				var country = new CountryModel();
				country.name = 'Puerto Rico'
				country.save(function(err){
					if(!err){
						console.log(country);
						CountryModel.findOne({"name":"Puerto Rico"}).exec(function(err,country){
							var state = new StateModel();
							state.name = 'San Jose'
							state.country = country._id
							state.save(function(err){
								if(!err){
									console.log(state);
								} else {
									console.log("Error: - " + err);
								}
							});
						})
					} else {
						console.log("Error: - " + err);
					}
				}); 

			})
			CountryModel.findOne({"name":"Argentina"}).exec(function(){

			})
	})
});
}