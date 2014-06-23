var UserRoles = require('../models/user').UserRoles;

exports.user = function (user) {
	if (!user) {
		return false
	} else {
		return true
	}
}

exports.promoter = function (user) {
	var index = user.roles.indexOf(UserRoles.getPromoter());
	if (index == -1) {
		return false
	} else {
		return true
	}
}

exports.seller = function (user) {
	var index = user.roles.indexOf(UserRoles.getSeller());
	if (index == -1) {
		return false
	} else {
		return true
	}
}

exports.partner = function (user) {

	var index = user.roles.indexOf(UserRoles.getPartner());
	if (index == -1) {
		return false
	} else {
		return true
	}
}

exports.member = function (user) {
	var index = user.roles.indexOf(UserRoles.getMember());
	if (index == -1) {
		return false
	} else {
		return true
	}
}

exports.generalAdministrator = function (user) {
	var index = user.roles.indexOf(UserRoles.getGeneralAdministrator());
	if (index == -1) {
		return false
	} else {
		return true
	}
}

exports.franchisorAdministrator = function (user) {
	var index = user.roles.indexOf(UserRoles.getFranchisorAdministrator());
	if (index == -1) {
		return false
	} else {
		return true
	}
}