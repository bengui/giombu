var UserModel 	= require('../models/user').UserModel;
var DealModel 	= require('../models/deal').DealModel;
var LevelModel 	= require('../models/level').LevelModel;
var InvitationModel 	= require('../models/invitation').InvitationModel;
var CheckAuth = require('../middleware/checkAuth');
var mongoose = require('mongoose');
module.exports = function(app){

	var parse_month_year_response = function(totals){
		var processed_totals = {};
		var keys = [];
		var values = [];
		for (var i = 0; i< totals.length ; i++) {
			keys.push(totals[i]._id.month_created.toString() +"/"+ totals[i]._id.year_created.toString())
			values.push(totals[i].cant)
		};
		processed_totals.keys = keys;
		processed_totals.values = values;
		return processed_totals;
	}

	var parse_week_month_year_response = function(totals){
		var processed_totals = {};
		var keys = [];
		var values = [];
		for (var i = 0; i< totals.length ; i++) {
			keys.push(totals[i]._id.week_created.toString()+" "+totals[i]._id.month_created.toString() +"/"+ totals[i]._id.year_created.toString())
			values.push(totals[i].cant)
		};
		processed_totals.keys = keys;
		processed_totals.values = values;
		return processed_totals;
	}

	app.get('/stats',CheckAuth.admin, function(req, res, next){
		res.render('stats/stats', {title: 'Estadisticas'});
	});

	//Evolucion de una variable en el tiempo
	app.get('/stats/new_users', function(req, res, next){
		var totals = [];
		UserModel.aggregate(
		    { $group : { _id:{month_created:{ $month : "$created" },year_created:{ $year : "$created" }} , cant : { $sum : 1 } } },
		    { $sort : { "_id.month_created" : 1 }}
		  , 
	      function (err, totals){
	      		if (err) {res.send(err)}
	             	res.send(parse_month_year_response(totals))
	           	}
			);
	});

	app.get('/stats/new_invitations', function(req, res, next){
		var totals = [];
		InvitationModel.aggregate(
		    { $group : { _id:{month_created:{ $month : "$created" },year_created:{ $year : "$created" }} , cant : { $sum : 1 } } },
		    { $sort : { "_id.month_created" : 1 }}
		  , 
	      function (err, totals){
	      		if (err) {res.send(err)}
	      			res.send(parse_month_year_response(totals))
	           	}
			);
	});

	app.get('/stats/new_deals', function(req, res, next){
		var totals = [];
		DealModel.aggregate(
		    { $group : { _id:{month_created:{ $month : "$created" },year_created:{ $year : "$created" }} , cant : { $sum : 1 } } },
		    { $sort : { "_id.month_created" : 1 }}
		  , 
	      function (err, totals){
	      		if (err) {res.send(err)}
	      			res.send(parse_month_year_response(totals))
	           	}
			);
	});

	app.get('/stats/new_sales', function(req, res, next){
		var totals = [];
		DealModel.aggregate(
			{ $unwind: "$sales" },
		    { $project : { month_created : { $month : "$sales.created" },	year_created : { $year : "$sales.created" }  } }  ,
		    { $group : { _id : {month_created:"$month_created",year_created:"$year_created" } , cant : { $sum : 1 } } },
		    { $sort : { "_id.month_created" : 1 ,"_id.year_created" : 1 }}
		  , 
	      function (err, totals){
	      		if (err) {res.send(err)}
	      			res.send(parse_month_year_response(totals))
	           	}
			);
	});

	app.get('/stats/weekly_sales', function(req, res, next){
		var totals = [];
		DealModel.aggregate(
			{ $unwind: "$sales" },
			{ $unwind: "$sales.coupons" },
		    { $match: {$or:[{ "sales.status": "Approved" } ,{ "sales.status": "Pending" }]}},
		    { $project : { year_created : { $year : "$sales.created" } ,month_created : { $month : "$sales.created" },	week_created : { $week : "$sales.created" }, amount :  "$special_price" }  } ,
		    { $group : { _id : {week_created:"$week_created" , month_created:"$month_created", year_created:"$year_created"} , cant : { $sum : "$amount" } } },
		    { $sort : { "_id.week_created" : 1 }}
		  , 
	      function (err, totals){ 
	      		if (err) {res.send(err)}
	            	res.send(parse_week_month_year_response(totals))
	           }
			);
	});

	app.get('/stats/monthly_promoters', function(req, res, next){
		UserModel.aggregate(
		    { $match:  { "roles":{ $in: ["promoter"] }}},
		    { $group : { _id:{month_created:{ $month : "$created" },year_created:{ $year : "$created" }} , cant : { $sum : 1 } } },
		    { $sort : { "_id.month_created" : 1 }}
		  , 
	      function (err, totals){ 
	      		if (err) {res.send(err)}
	            	res.send(parse_month_year_response(totals))
	           }
			);
	});
	
	//Hay que pulir lo que vuelve
	app.get('/stats/promoter_level_proportions', function(req, res, next){
		UserModel.aggregate(
			{ $match:  { "roles":{ $in: ["promoter"] }}},
		    { $group : { _id: "$level" ,level: {$push: '$level'},cant : { $sum : 1 } }}
		  , 
	      function (err, totals){
	      		if (err) {res.send(err)}
	      			console.log(totals)
	      			LevelModel.populate(totals, {path: "level"}, function(err, totals2){
	      				res.send(JSON.stringify(totals2))
	      			});
	           	}
			);
	});

	//Numeros disctretos
	app.get('/stats/count_sellers', function(req, res, next){
		UserModel.aggregate(
		    { $match:  { "roles":{ $in: ["seller"] }}},
		    { $group : { _id : "" , cant : { $sum : 1 } } },
		    { $sort : { "_id.week_created" : 1 }}
		  , 
	      function (err, totals){ 
	      		if (err) {res.send(err)}
	            	res.send(JSON.stringify(totals[0].cant))
	           }
			);
	});

	app.get('/stats/count_partners', function(req, res, next){
		UserModel.aggregate(
		    { $match:  { "roles":{ $in: ["partner"] }}},
		    { $group : { _id : "" , cant : { $sum : 1 } } },
		    { $sort : { "_id.week_created" : 1 }}
		  , 
	      function (err, totals){ 
	      		if (err) {res.send(err)}
	            	res.send(JSON.stringify(totals[0].cant))
	           }
			);
	});

	app.get('/stats/count_promoters', function(req, res, next){
		UserModel.aggregate(
		    { $match:  { "roles":{ $in: ["promoter"] }}},
		    { $group : { _id : "" , cant : { $sum : 1 } } },
		    { $sort : { "_id.week_created" : 1 }}
		  , 
	      function (err, totals){ 
	      		if (err) {res.send(err)}
	            	res.send(JSON.stringify(totals[0].cant))
	           }
			);
	});

	app.get('/stats/count_users', function(req, res, next){
		UserModel.aggregate(
		    { $group : { _id : "" , cant : { $sum : 1 } } }
		  , 
	      function (err, totals){ 
	      		if (err) {res.send(err)}
	            	res.send(JSON.stringify(totals[0].cant))
	           }
			);
	});

	

}