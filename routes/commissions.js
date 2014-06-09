var EventModel = require('../models/event').EventModel;
var CouponModel = require('../models/coupon').CouponModel;
var BonusModel = require('../models/bonus').BonusModel;
var DealModel = require('../models/deal').DealModel;
var CommissionModel = require('../models/commission').CommissionModel;

module.exports = function(app){

	app.on('redeem_coupon', function(deal, sale, code ){
		//Commission partner
		StoreModel.find({"branches":{ $in : [sale.branch]}}).populate("branches").exec(function(err, store){
			if(store){
				var branch = store.branches.id(sale.branch)
				var commission_new = new CommissionModel(); 
				commission_new.user_id = deal.seller;
				//MARCAR EL CUPON COMO CANJEADO
				var sale_index = -1;
				var code_index = -1;
				for (var i = 0 ; i < deal.sales.length ; i++) {
					if(deal.sales[i]._id === sale._id ){
						sale_index = i;
					}
				};
				for (var i = 0; deal.sales[sale_index].coupons ; i++) {
					if(deal.sales[sale_index].coupons[i].code === code ){
						code_index = i;
					}
				};
				var update_string = "sales."+sale_index+".coupons."+code_index+".status";
				DealModel.update( {"_id" : deal._id } , 
				                {$set : {update_string : "redeemed"} } , 
				                false , 
				                true);
				commission_new.sale = sale._id;
				commission_new.currency = deal.currency
				commission_new.amount = (deal.promoter_percentage)/100*(deal.special_price)*(sale.coupons.length);
				commission_new.save(function(){
					app.emit("redeemed_coupon", sale, code);
					app.emit("commission_event", "Commission_Seller", deal, commission_new);
				});
			}	
		});
	});

	app.on('sale', function (deal , user, sale) {

		//user es el usuario que la compró
		//Necesitamos usuarios para comparar los niveles
		
		//Bonus.
		if(typeof user.promoter._id !== "undefined"){
			console.log(user)
			var bonus_new = new BonusModel();
			var level_multiplicator;
			if(user.level.bonus <= user.promoter.level.bonus){
				level_multiplicator = user.level.bonus
			}else{
				level_multiplicator = user.promoter.level.bonus
			}
			bonus_new.amount = 8*level_multiplicator*deal.special_price
			bonus_new.user = user._id
			bonus_new.promoter = user.promoter._id
			bonus_new.currency = deal.currency
			bonus_new.save(function(err){
				app.emit("new_bonus_event", deal);
			});

			//Commision al promoter
			var commission_new = new CommissionModel();          
			commission_new.user_id = user.promoter;
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
			commission_new.user_id = deal.seller;
			commission_new.sale = sale._id;
			commission_new.currency = deal.currency
			commission_new.amount = (deal.seller_percentage)/100*(deal.special_price)*(sale.coupons.length);
			commission_new.save(function(err){
				app.emit("commission_event", "Commission_Seller", deal, commission_new);
			});
		}
		
	});

	app.on('redeem_coupon',function(deal, sale, code ){
		//Commission partner
		var pos = -1;
		for (var i = deal.stores.length - 1; i >= 0; i--) {
			if(deal.stores[i]._id === sale._id){
				pos = i
			}else{

			}
		};
		if(pos >= 0){
			StoreModel.find({"branches":{ $in : [sale.branch]}}).populate("branches").exec(function(err, store){
				if(store){
					var branch = store.branches.id(sale.branch)
					var commission_new = new CommissionModel(); 
					commission_new.user_id = deal.seller;
					//MARCAR EL CUPON COMO CANJEADO
					var coupon = deal.sales.coupon.id(code);
					commission_new.sale = sale._id;
					commission_new.currency = deal.currency
					commission_new.amount = (deal.promoter_percentage)/100*(deal.special_price)*(sale.coupons.length);
					commission_new.save(function(err){
						var setstring = "sales."+pos+".coupons.$.status";
						var querystring = "sales."+pos+".coupons.$.code"
						DealModel.update({querystring:code}, {$set:{setstring:"Redeemed"}});
					})
				}	
			})
		}else{
			res.send("No encontrado")
		}
	})
}