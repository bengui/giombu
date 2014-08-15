var UserRoles = require('../models/user').UserRoles;

exports.user = function (req, res, next) {
	if (!req.session.user) {
		console.log('ERROR - user not logged in');
		res.redirect('/');
	} else {
		next();
	}
}

exports.promoter = function (req, res, next) {
	var index = req.session.user.roles.indexOf(UserRoles.getPromoter());
	if (index == -1) {
		console.log('not allowed');
		res.render('error', {
			description : 'El usuario logueado no es promotor'
		});
	} else {
		next();
	}
}

exports.seller = function (req, res, next) {
		var index = req.session.user.roles.indexOf(UserRoles.getSeller());
	if (index == -1) {
		console.log('not allowed');
		res.render('error', {
			description : 'El usuario logueado no es vendedor'
		});
	} else {
		next();
	}
}

exports.partner = function (req, res, next) {

	var index = req.session.user.roles.indexOf(UserRoles.getPartner());
	if (index == -1) {
		console.log('not allowed');
		res.render('error', {
			description : 'El usuario logueado no es socio'
		});
	} else {
		next();
	}
}

exports.member = function (req, res, next) {
	var index = req.session.user.roles.indexOf(UserRoles.getMember());
	if (index == -1) {
		res.render('error', {
			description : 'El usuario logueado no es miembro'
		});
	} else {
		next();
	}
}

exports.generalAdministrator = function (req, res, next) {
	var index = req.session.user.roles.indexOf(UserRoles.getGeneralAdministrator());
	if (index == -1) {
		console.log('not allowed');
		res.render('error', {
			description : 'El usuario logueado no es Administrador General'
		});
	} else {
		next();
	}
}

exports.franchisorAdministrator = function (req, res, next) {
	var index = req.session.user.roles.indexOf(UserRoles.getFranchisorAdministrator());
	if (index == -1) {
		console.log('not allowed');
		res.render('error', {
			description : 'El usuario logueado no es Administrador de la Franquicia'
		});
	} else {
		next();
	}
}