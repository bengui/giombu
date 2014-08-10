var BonusModel = require('../models/bonus').BonusModel;
var UserModel = require('../models/user').UserModel;
var DealModel = require('../models/deal').DealModel;
var PaymentModel = require('../models/payment').PaymentModel;
var BankAccountModel = require('../models/bank_account').BankAccountModel;
var CommissionModel = require('../models/commission').CommissionModel;
var mongoose = require('mongoose');

module.exports = function(app){
	app.get('/payments/create', function (req, res, next) {
		today = new Date()
		month_ago = new Date()
		var oneWeekAgo = new Date();
		oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
		CommissionModel.find({user:req.session.user._id}).exec(function(err, commissions ){
			if (err) throw err;
			BonusModel.find({user:req.session.user._id}).populate("promoter").exec(function(err, bonuses ){
				if (err) throw err;
				BankAccountModel.find({"user":req.session.user._id}).exec(function(err, bankaccounts ){
					if (err) throw err;
					PaymentModel.findOne({"user":req.session.user._id , "created": {$gte : oneWeekAgo}}).exec(function(err,payment){
						if (err) throw err;
						res.render('payments/create', {title: 'Seccion de pagos' ,bankaccounts:bankaccounts, bonuses:bonuses, commissions:commissions, payment:payment});
					})
				});
			});
		});
	  
	});

	app.get('/payments', function(req, res, next){
		PaymentModel.find({}).exec( function(err, payments){
			if (err) throw err;
			res.json(payments);
		});
	});

	app.post('/payments/new', function (req, res, next) {
		UserModel.findOne({_id:req.session.user._id}).exec(function(err, user ){
			var amount = 0;
			CommissionModel.find({ _id :{ $in : req.param('commissions') }}).exec(function(err, commissions ){
				console.log(commissions)
			var date = Date.now()
				for (var i = commissions.length - 1; i >= 0; i--) { //error aca y en el otro loop
					amount = commissions[i].amount + amount;
					commissions[i].paid_date = date
					commissions[i].save(function(err){
						if(err){
							console.log("Error: - " + err);
						}
					})
				};
				var bonusesSelected = [];
				if(typeof req.param('bonuses') !== "Array"){
					bonusesSelected.push(req.param('bonuses'))
				}else{
					bonusesSelected = req.param('bonuses')
				}
				var ids = []
				for (var i = bonusesSelected.length - 1; i >= 0; i--) {
					ids.push( mongoose.Types.ObjectId(bonusesSelected[i]))
				};
				BonusModel.find({ _id :{ $in : ids }}).exec(function(err,  bonuses ){
					
					if(bonuses){
						for (var i = bonuses.length - 1; i >= 0; i--) {
							amount = bonuses[i].amount + amount;
						};
						
					}else{
						
					}
					payment_new = new PaymentModel();
					payment_new.bank_account = req.param("bank_account")
					payment_new.commissions = req.param('commissions');
					payment_new.bonuses = req.param('bonuses');
					payment_new.amount = amount;
					payment_new.user = req.session.user._id;
					payment_new.save(function(){
						req.session.messagge = "Pago creado, no podrá volver a realizar esta acción hasta dentro de 7 dias";
						
						BonusModel.update({"user":req.session.user._id, _id :{ $in : ids }}, { $set: { paid_date:  date}}, { multi: true },function (err, numberAffected, raw) {
							res.redirect('/payments/create');			
						});
					})
				});	
			});
			
			
		});

		
	});
}
