var EventModel = require('../models/event').EventModel;
var CouponModel = require('../models/coupon').CouponModel;
var BonusModel = require('../models/bonus').BonusModel;
var NewModel = require('../models/new').NewModel;
var CommissionModel = require('../models/commission').CommissionModel;
var UserModel = require('../models/user').UserModel;
var DealModel = require('../models/deal').DealModel;

module.exports = function(app){

	function sendNew(user, data){
		if(user.sockets_list.length > 0){
			user.sockets_list.forEach(function(socket_id){
				app.io.sockets.socket(socket_id).emit('news.new', data);
			});
		}
	}


	//Este metodo es solo para testing de los eventos
	//Hay que eliminarlo - bengui
	app.get('/event_test', function(req, res){
		
		var query = DealModel.findOne({});
		query.exists('seller');
		query.exec(function(err, deal){
			CommissionModel.findOne({}, function(err, commission){
				UserModel.findOne({ username : 'bengui'}, function(err, user){
					app.emit('commission_event', 'Commission', deal, commission, user);
					res.send('Yeah!');
				});

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

				UserModel.findById(new_new.to_user, function(err, user_to){
					if (err) throw err;
					if(user_to){

						var data = {};
						data.message = event.body
							.replace('%f', user.name + ' ' + user.lname)
							.replace('%d', deal.title)
							.replace('%a', commission.amount);
						data.title = 'Comision';
						sendNew(user, data);
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

				UserModel.findById(new_new.to_user, function(err, user){
					if (err) throw err;
					if(user){
						sendNew(user, data);
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
						sendNew(user, data);
					}
				});
			});
		});
	});


}
