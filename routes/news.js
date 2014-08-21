var EventModel = require('../models/event').EventModel;
var CouponModel = require('../models/coupon').CouponModel;
var BonusModel = require('../models/bonus').BonusModel;
var NewModel = require('../models/new').NewModel;
var CommissionModel = require('../models/commission').CommissionModel;
var UserModel = require('../models/user').UserModel;
var DealModel = require('../models/deal').DealModel;
var CheckAuth = require('../middleware/checkAuth');
var news_builder = require('../helpers/news_builder');
var util = require('../helpers/util');

module.exports = function(app){

	function sendNew(user, data){
		if(user.sockets_list.length > 0){
			user.sockets_list.forEach(function(socket_id){
				app.io.sockets.socket(socket_id).emit('news.new', data);
			});
		}
	}

	app.get('/news/reset', function(req, res){
		NewModel.find({}, function(err, news){
			for (var i = news.length - 1; i >= 0; i--) {
				news[i].informed = false;
				news[i].save(function(err){
					if (err) throw err;
					res.send('Noticias reseteadas');
				});
			};
		});
	});

	app.get('/news', CheckAuth.user, function(req, res){

		NewModel.find({ to_user : req.session.user._id, informed:false})
		.populate('to_user')
		.populate('from_user')
		.populate('deal')
		.populate('event')
		.exec(function(err, news_list){
			if(err) throw err;
			var packed_new;
			
			var packed_new_list = [];
			for (var i = news_list.length - 1; i >= 0; i--) {
					
					packed_new = {};
					packed_new.title = news_list[i].event.type;
					packed_new.message = news_builder.make_news_string(news_list[i]);
					packed_new.date = util.date_time_string(news_list[i].created);
					packed_new_list.push(packed_new);
			}

			res.render('news/list',{
				title 		: 'Noticias',
				news_list	: packed_new_list
			});
		});

	});


	app.on('commission_event', function (type , deal, commission, user) {
		var query = EventModel.findOne({ 'name': type });
		query.exec(function (err, event) {
			if (err) return handleError('Event not found, error:'+err);
			var new_new = new NewModel();
			new_new.event = event._id;
			new_new.to_user = deal.seller;
			new_new.deal = deal._id;
			new_new.commission = commission._id;
			new_new.save(function(err){
				if (err) throw err;

				UserModel.findById(new_new.to_user, function(err, user_target){
					if (err) throw err;
					if(user_target){

						var data = {};
						data.message = event.body
							.replace('%f', user.name + ' ' + user.lname)
							.replace('%d', deal.title)
							.replace('%a', commission.amount);
						data.title = 'Comision';
						sendNew(user_target, data);
					}
				});
			});
		});
	});

	app.on('redeemed_coupon', function (deal, sale, code ,user_id) {
		var query = EventModel.findOne({ 'name': 'Coupon_Redeemed' });
		query.exec(function (err, event) {
			if (err) return handleError('Event not found, error:'+err);
			var new_new = new NewModel();
			new_new.event = event._id;
			new_new.to_user = deal.seller;
			new_new.deal = deal._id;
			new_new.save(function(err){
				if (err) throw err;

				UserModel.findById(new_new.to_user, function(err, user_target){
					if (err) throw err;
					if(user_target){
						UserModel.findById(user_id, function(err, user){
							if (err) throw err;
							if(user){
								var data = {};
								data.message = event.body
									.replace('%f', user.name + ' ' + user.lname);
								data.title = 'Cupón';
								sendNew(user_target, data);
							}
						});
					}
				});
			});
		});
		var query = EventModel.findOne({ 'name': 'Your_Coupon_Redeemed' });
		query.exec(function (err, event) {
			if (err) return handleError('Event not found, error:'+err);
			var new_new = new NewModel();
			new_new.event = event._id;
			new_new.to_user = sale.user;
			new_new.deal = deal._id;
			new_new.save(function(err){
				if (err) throw err;

				UserModel.findById(new_new.to_user, function(err, user){
					if (err) throw err;
					if(user){
						var data = {};
						data.message = event.body
							.replace('%d', deal.title);
						data.title = 'Cupón';
						sendNew(user, data);
					}
				});
			});
		});
	});


}
