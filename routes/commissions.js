var EventModel = require('../models/event').EventModel;
var CouponModel = require('../models/coupon').CouponModel;
var BonusModel = require('../models/bonus').BonusModel;
var DealModel = require('../models/deal').DealModel;
var CommissionModel = require('../models/commission').CommissionModel;

module.exports = function(app){

	app.on('sale', function (deal , user, sale) {

		//user es el usuario que la compró
		//Necesitamos usuarios para comparar los niveles
		console.log("Evento")
		console.log(user)
		//Bonus.
		if(typeof user.promoter_id !== "undefined"){
			console.log(user)
			var bonus_new = new BonusModel();
			var level_multiplicator;
			if(user.level.bonus <= user.promoter_id.level.bonus){
				level_multiplicator = user.level.bonus
			}else{
				level_multiplicator = user.promoter_id.level.bonus
			}
			bonus_new.amount = 8*level_multiplicator*deal.special_price
			bonus_new.user = user._id
			bonus_new.promoter = user.promoter_id._id
			bonus_new.currency = deal.currency
			bonus_new.save(function(err){
				app.emit("new_bonus_event", deal);
			});

			//Commision al promoter
			var commission_new = new CommissionModel();          
			commission_new.user = user.promoter_id._id;
			commission_new.sale = sale._id;
			commission_new.currency = deal.currency
			commission_new.amount = (deal.promoter_percentage)/100*(deal.special_price)*(sale.coupons.length);
			commission_new.save(function(err){
				app.emit("commission_event", "Commission", deal, commission_new);
			});
		}
		
		if(typeof deal.seller !== "undefined"){
			//Commission seller
			var commission_new = new CommissionModel(); 
			commission_new.user = deal.seller;
			commission_new.sale = sale._id;
			commission_new.currency = deal.currency
			commission_new.amount = (deal.seller_percentage)/100*(deal.special_price)*(sale.coupons.length);
			commission_new.save(function(err){
				app.emit("commission_event", "Commission_Seller", deal, commission_new);
			});
		}
		
	});

	app.on('redeemed_coupon',function(deal, sale, code ,user_id){
		var commission_new = new CommissionModel(); 
		commission_new.user_id = user_id;
		commission_new.sale = sale._id;
		commission_new.currency = deal.currency
		commission_new.amount = (deal.partner_percentage)/100*(deal.special_price);
		commission_new.save(function(){
			app.emit("commission_event", "Commission_Partner", deal, commission_new);
		});
	});


}