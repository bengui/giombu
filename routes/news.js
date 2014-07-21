var EventModel = require('../models/event').EventModel;
var CouponModel = require('../models/coupon').CouponModel;
var BonusModel = require('../models/bonus').BonusModel;
var NewModel = require('../models/new').NewModel;
var CommissionModel = require('../models/commission').CommissionModel;

module.exports = function(app){

	app.on('commission_event', function (type , deal, commission) {
		var query = EventModel.findOne({ 'name': type });
		query.exec(function (err, event) {
			if (err) return handleError("Event not found, error:"+err);
			var new_new = new NewModel();
			new_new.event = event._id;
			new_new.to_user = deal.seller;
			new_new.deal = deal._id;
			new_new.commission = commission._id;
			new_new.save(function(err){

			});
		});
	});

	app.on('redeemed_coupon', function (deal, sale, code ,user_id) {
		var query = EventModel.findOne({ 'name': 'Coupon_Redeemed' });
		query.exec(function (err, event) {
			if (err) return handleError("Event not found, error:"+err);
			var new_new = new NewModel();
			new_new.event = event._id;
			new_new.to_user = deal.seller;
			new_new.deal = deal._id;
			new_new.save(function(err){

			});
		});
		var query = EventModel.findOne({ 'name': 'Your_Coupon_Redeemed' });
		query.exec(function (err, event) {
			if (err) return handleError("Event not found, error:"+err);
			var new_new = new NewModel();
			new_new.event = event._id;
			new_new.to_user = sale.user;
			new_new.deal = deal._id;
			new_new.save(function(err){

			});
		});
	});

	app.on('add_new_to_user', function(newModel){
		//La variable new es una instancia de NewModel
		UserModel.findById( newModel.to_user, function(err, user){
			if(err) throw err;

			if(user){
				user.news_list.push(newModel);
				user.save(function(err){
					if(user.sockets_list.length > 0){
						user.sockets_list.forEach(function(socket_id){
							app.io.sockets.socket(socket_id).emit('new', newModel);
						});
					}
				});


			}
		});
	});


}
