var UserModel 	= require('../models/user').UserModel;
var DealModel 	= require('../models/deal').DealModel;
var InvitationModel 	= require('../models/invitation').InvitationModel;
var CheckAuth = require('../middleware/checkAuth');
var mongoose = require('mongoose');
module.exports = function(app){

	app.get('/stats',CheckAuth.admin, function(req, res, next){
		res.render('stats/stats', {title: 'Estadisticas'});
	});

	app.get('/stats/new_users', function(req, res, next){
		var totals = [];
		UserModel.aggregate(
		    { $project : { month_created : { $month : "$created" },	year_created : { $year : "$created" }  } } ,
		    { $group : { _id : {month_created:"$month_created",year_created:"$year_created" } , cant : { $sum : 1 } } },
		    { $sort : { "_id.created" : 1 }}
		  , 
	      function (err, totals)
	           { if (err) {res.send(err)}
	             res.send(totals)
	           }
			);
	});

	app.get('/stats/new_invitations', function(req, res, next){
		var totals = [];
		InvitationModel.aggregate(
		    { $project : { month_created : { $month : "$created" },	year_created : { $year : "$created" }  } } ,
		    { $group : { _id : {month_created:"$month_created",year_created:"$year_created" } , cant : { $sum : 1 } } },
		    { $sort : { "_id.created" : 1 }}
		  , 
	      function (err, totals)
	           { if (err) {res.send(err)}
	             res.send(totals)
	           }
			);
	});

	app.get('/stats/new_deals', function(req, res, next){
		var totals = [];
		DealModel.aggregate(
		    { $project : { month_created : { $month : "$created" },	year_created : { $year : "$created" }  } } ,
		    { $group : { _id : {month_created:"$month_created",year_created:"$year_created" } , cant : { $sum : 1 } } },
		    { $sort : { "_id.created" : 1 }}
		  , 
	      function (err, totals)
	           { if (err) {res.send(err)}
	             res.send(totals)
	           }
			);
	});

	app.get('/stats/new_sales', function(req, res, next){
		var totals = [];
		DealModel.aggregate(
			{ $unwind: "$sales" },
		    { $project : { month_created : { $month : "$sales.created" },	year_created : { $year : "$sales.created" }  } }  ,
		    { $group : { _id : {month_created:"$month_created",year_created:"$year_created" } , cant : { $sum : 1 } } },
		    { $sort : { "_id.created" : 1 }}
		  , 
	      function (err, totals)
	           { if (err) {res.send(err)}
	             res.send(totals)
	           }
			);
	});

	app.get('/stats/weekly_sales', function(req, res, next){
		var totals = [];
		DealModel.aggregate(
			{ $unwind: "$sales" },
			{ $unwind: "$sales.coupons" },
		    { $match: {$or:[{ "sales.status": "Approved" } ,{ "sales.status": "Pending" }]}},
		    { $project : { month_created : { $month : "$sales.created" },	week_created : { $week : "$sales.created" }, amount :  "$special_price" }  } ,
		    { $group : { _id : {week_created:"$week_created" } , cant : { $sum : "$amount" } } },
		    { $sort : { "_id.created" : 1 }}
		  , 
	      function (err, totals)
	           { if (err) {res.send(err)}
	             res.send(totals)
	           }
			);
	});

}