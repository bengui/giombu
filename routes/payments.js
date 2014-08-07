var BonusModel = require('../models/bonus').BonusModel;
var UserModel = require('../models/user').UserModel;
var DealModel = require('../models/deal').DealModel;
var PaymentModel = require('../models/payment').PaymentModel;
var BankAccountModel = require('../models/bank_account').BankAccountModel;
var CommissionModel = require('../models/commission').CommissionModel;

module.exports = function(app){
	app.get('/payments/create', function (req, res, next) {
		today = new Date()
		month_ago = new Date()
		month_ago.setMonth(today.getMonth()-1)
		CommissionModel.find({user:req.session.user._id}).exec(function(err, commissions ){
			BonusModel.find({user:req.session.user._id}).populate("promoter").exec(function(err, bonuses ){
				BankAccountModel.find({user:req.session.user._id}).exec(function(err, account ){
					res.render('payments/create', {title: 'Seccion de pagos' , account:account, bonuses:bonuses, commissions:commissions});
				});
			});
		});
	  
	});

	app.post('/payments/new', function (req, res, next) {
		UserModel.findOne({_id:req.session.user._id}).exec(function(err, user ){
			var amount = 0;
			CommissionModel.find({ _id :{ $in : req.param('commissions') }}).exec(function(err, commissions ){
			
				for (var i = commissions.length - 1; i >= 0; i--) { //error aca y en el otro loop
					amount = commissions[i].amount + amount;
					commissions[i].paid_date = Date.now
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
					payment_new.commissions = req.param('commissions')
					payment_new.bonuses = req.param('bonuses')
					payment_new = new PaymentModel();
					payment_new.amount = amount;
					payment_new.user = req.session.user._id;
					payment_new.save(function(){
						req.session.messagge = "Pago creado, no podrá volver a realizar esta acción hasta dentro de 7 dias";
						BonusModel.update({user:req.session.user._id, _id :{ $in : ids }}, { $set: { paid_date: Date.now }}, { multi: true },function (err, numberAffected, raw) {
						 	req.session.user= user;
						 	user.save(function(){
						 		res.redirect('/payments/create');
						 	})			
						});
					})
				});	
			});
			
			
		});

		
	});
}
