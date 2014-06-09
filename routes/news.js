var EventModel = require('../models/event').EventModel;
var CouponModel = require('../models/coupon').CouponModel;
var BonusModel = require('../models/bonus').BonusModel;
var CommissionModel = require('../models/commission').CommissionModel;

module.exports = function(app){

	app.on('commission_event', function (deal , type, commission) {
		var query = EventModel.findOne({ 'name': type });
		query.exec(function (err, event) {
			if (err) return handleError("Event not found, error:"+err);
			new_new.event = event._id;
			new_new.to_user = deal.seller;
			new_new.deal = deal._id;				
			new_new.save(function(err){

			});
		});
	});

	app.on('redeemed_coupon', function (sale , code) {
		var query = EventModel.findOne({ 'name': type });
		query.exec(function (err, event) {
			if (err) return handleError("Event not found, error:"+err);
			new_new.event = event._id;
			new_new.to_user = deal.seller;
			new_new.deal = deal._id;				
			new_new.save(function(err){

			});
		});
	});


}