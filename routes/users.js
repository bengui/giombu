var UserModel 	= require('../models/user').UserModel;
var UserRoles 	= require('../models/user').UserRoles;
var ImageModel 	= require('../models/image').ImageModel;
var DealModel 	= require('../models/deal').DealModel;
var SubscriberModel = require('../models/subscriber').SubscriberModel;
var BonusModel = require('../models/bonus').BonusModel;
var LevelModel = require('../models/level').LevelModel;
var CountryModel = require('../models/country').CountryModel;
var StateModel = require('../models/state').StateModel;
var CityModel = require('../models/city').CityModel;
var InvitationModel = require('../models/invitation').InvitationModel;
var CommissionModel = require('../models/commission').CommissionModel;
var CheckAuth = require('../middleware/checkAuth');
var util = require('../helpers/util');
var encrypter = require('../helpers/encryption');
var _ = require('underscore');

module.exports = function(app){


	//Este regex nos permite pedir la misma funcion como json, para usar donde necesitamos elegir quien nos invito y similar.
	app.get('/users:format(.json)?', function(req, res, next){
		UserModel.find().exec( function(err, users){
			if (err) throw err;
			if(req.params.format){
				usernames = [];
				for (var i = users.length - 1; i >= 0; i--) {
					usernames.push(users[i].username)
				};
				res.send(usernames)
			}
			res.render('users/list', {title: 'Lista de usuarios', users:users});
		});
	});


	app.get('/users/create', function(req, res){
		CountryModel.find({}, function(err, countries){
			if (err) throw err;

			StateModel.find({}, function(err, states){
				if (err) throw err;

				CityModel.find({}, function(err, cities){
					if (err) throw err;

					res.render('users/create', {
						title 		: 'Registro',
						countries 	: countries,
						states		: states,
						cities		: cities
					});

				});

			});

		});
	});


	app.post('/users/save', function(req, res){

		function finishRegistration(user){
			req.session.message = 'Te has registrado correctamente';
			//Save the user in the session
			req.session.user = user;
			req.session.expose.user = user;
			req.session.expose.selected_franchise = 'Guadalajara';

			res.redirect('/');
		}

		req.body.user.password = encrypter.encrypt(req.body.user.password);

		var user = new UserModel(req.body.user);
		user.roles.push(UserRoles.getUser());
		console.log(req.body.invitation)
		if(req.body.invitation != ""){
			InvitationModel.findOne({ "_id": req.body.invitation }).populate("invite_user").exec(function (err, invitation) {
				if (invitation) {

					if(typeof invitation.invitation_type !== "undefined"){
						switch(invitation.invitation_type){
							//Ver donde vamos a manejar este evento.
						    //app.emit("invitation_accepted", invitation)
							case "seller":
								user.roles.push(UserRoles.getSeller());
							break;
							case "promoter":
								user.roles.push(UserRoles.getPromoter());
							break;
						}
					}

					UserModel.findOne({username: req.body.user.inviter}, function(err, inviter){
						if (err) throw err;
						if(inviter){
							user.promoter_id = inviter._id;
							user.invitation.push(invitation)
						}

						user.save(function(err){
							if (err) throw err;
							finishRegistration(user);
						});
					});
				}else{
					user.save(function(err){
						if (err) throw err;
						finishRegistration(user);
					});
				}
			});

		}
	});

	//Habria que agregar validaciones a esta llamada.
	//un usuario comun solo debe poder editar sus datos.
	//y solo el admin debe poder editar los datos de cualquier usuario.
	app.get('/users/edit/:id', function(req, res){
		UserModel.findById( req.params.id , function(err, user){

			if (err) throw err;

			res.render('users/edit', {
				title 	: 'Editar usuario',
				user 	: user
			});
		});

	});

	app.get('/users/login', function (req, res, next){
		res.render('users/login', { title:'Autenticación'});
	});


	app.post('/users/login', function(req, res, next){
		UserModel.findOne({username: req.body.username}).populate("images").exec(function(err, user){
			if(err) throw err;

			if(!user){
				req.session.error = 'Usuario o contraseña incorrectos';
				res.redirect('/');
			}else{
				if(user.password == encrypter.encrypt(req.body.password)){

						//Save the user in the session
						req.session.user = user;

						//Expose some user data to the front-end
						req.session.expose.user = {};
						req.session.expose.selected_franchise = 'Guadalajara';
						req.session.expose.user = user;


						updateUserLevel(req, res, function(){
							req.session.message = 'Hola!';
							res.redirect('/');
						});


				}else{
					req.session.error = 'Usuario o contraseña incorrectos';
					res.redirect('/');
				}

			}

		});
	});


	app.get('/users/logout', function(req, res, next){
		delete req.session.user;
		delete req.session.expose;
		req.session.message = 'Vuelva pronto';
		res.redirect('/');
	});


	function updateUserLevel(req, res, callback){

		UserModel.find({promoter_id : req.session.user._id}).exec(function (err, sons){
			if(sons){

				var number = sons.length/10+1;

				LevelModel.findOne({'number' : {$gte : number}}).sort({'number': 1}).exec(function(err, level){

					if (err) throw err;

					if(level){
						req.session.user.level = level._id;
						req.session.expose.user.level = level;

						req.session.user.save(function(err){
							if (err) throw err;
							callback();
						});


					}else{
						LevelModel.findOne({'number' : LevelModel.MAX_LEVEL}, function(err, level){

							if (err) throw err;

							req.session.user.level = level._id;

							req.session.user.save(function(err){
								if (err) throw err;
								callback();
							});

						});
					}
				});
			}
		});

	}

	app.get('/users/validate/:username', function(req, res){
		UserModel.findOne( { username : req.params.username }, function(err, user){
			if (err) throw err;

			if(user){
				res.json(true);
			}else{
				res.json(false);
			}
		});
	});

	app.get('/users/contacts', function(req, res){
		UserModel.find({ 'promoter_id': req.session.user._id}).populate("images").exec( function(err, sons){
			console.log(sons);
			if(sons){
				res.render('users/contacts', {title: 'Tus Contactos', sons:sons});
			}else{
				var sons = new Array(1);
				sons[0] = req.session.user;
				console.log(sons);
				res.render('users/contacts', {title: 'Tus Contactos',sons:sons});
			}
			console.log(sons);
		});
	});

	app.post('/users/addRole', function(req, res){
		UserModel.update( { _id : req.body.id }, { $addToSet: { roles : req.body.role } }, callback);
		function callback (err, numAffected) {
		  	res.redirect('/users/profile/'+req.body.id.toString());
		}

	});

	app.get('/users/message', function(req, res){
		UserModel.find({}, function(err, users){
			if (err) throw err;

			res.render('users/message', {
				title 		: 'Enviar mensaje',
				users 		: users
			});
		});
	});

	app.get('/users/profile/edit', CheckAuth.user, function(req, res){
		UserModel.findById(req.session.user._id)
		.populate('city')
		.exec(function(err, user){
			if (err) throw err;

			if(!user){
				redirect('/users/logout');
			}

			StateModel.findById( user.city.state , function(err, state){
				if (err) throw err;

				CountryModel.find( {} , function(err, countries){
					if (err) throw err;

					StateModel.find( { country : state.country }, function(err, states){
						if (err) throw err;

						CityModel.find( {state : state._id}, function(err, cities){
							if (err) throw err;
							res.render('users/edit_profile',{
								title 		: 'Editar datos de usuario',
								user 		: user,
								state 		: state,
								states 		: states,
								countries 	: countries,
								cities 		: cities

							});
						});
					});
				});
			});
		});
	});

	app.post('/users/profile/edit', CheckAuth.user, function(req, res){
		UserModel.findById(req.session.user._id, function(err, user){

			_.extend(user, req.body.user);

			user.save(function(err){
				if (err) throw err;
				res.redirect('/users/profile');
			});


		});
	});


	app.get('/users/profile/:id?*', CheckAuth.user, function(req, res){
		var id;
		if(req.params.id){
			id = req.params.id
		}else{
			id = req.session.user._id
		}
		UserModel.findOne({"_id" : id})
		.populate('city').populate("images")
		.exec(function(err, user){
			if (err) throw err;
			if(user){
				console.log(user)
				StateModel.findById( user.city.state , function(err, state){
				if (err) throw err;
					CountryModel.findById( state.country, function(err, country){
						if (err) throw err;
						BonusModel.find( {"user" : id}, function(err, bonuses){
							if(!err){
								CommissionModel.find( {"user" : id}, function(err, commissions){
									console.log(commissions)
									if(!err){
										res.render('users/profile',{
											title 	: 'Datos de usuario',
											user 	: user,
											state 	: state,
											country : country,
											bonuses : bonuses,
											commissions : commissions,
											id : id
										});
									}else{
										if (err) return handleError(err);
									}
								});
							}else{
								if (err) return handleError(err);
							}
						});
					});
				});
			}else{
				if(req.session.user._id){
					redirect('/users/logout');
				}else{
					redirect('/');
				}
			}


		});
	});


	//Esta llamada es muy general es por eso que debe ir a lo ultimo.
	//Por ejemplo si esta llamada esta al principio del archivo, cuando se llama a /users/login
	//toma 'login' como si fuese un ID de algun user. Este caso es valido para llamadas similares.
	app.get('/users/:id', function(req, res){
		UserModel.findById(req.params.id).populate('images').exec( function(err, user){
			console.log(user.images)
			if (err) throw err;
			UserModel.find({'promoter_id':req.params.id}, function (err, contacts) {
				if (err) return handleError(err);
				DealModel.find({'sales.user':req.params.id}).sort("-created").exec(function (err, deals) {
					if (err) return handleError(err);
					SubscriberModel.find({'email':user.email}).populate('franchise').exec( function (err, subscriptions) {
						if (err) return handleError(err);
						BonusModel.find( {user : req.params.id}, function(err, bonuses){
							if(!err){
								res.render('users/view', {title: 'Perfil', user: user,bonuses:bonuses, contacts:contacts,deals:deals,subscriptions:subscriptions});
							}else{
								if (err) return handleError(err);
							}
						});
					});
				});
			});
		});
	});

}
