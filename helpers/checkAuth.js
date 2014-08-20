var UserRoles = require('../models/user').UserRoles;

exports.user = function (user) {
	if (!user) {
		return false
	} else {
		return true
	}
}
exports.admin = function (user) {
	var index = user.roles.indexOf(UserRoles.getAdmin());
	if (index == -1) {
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

exports.list = function (user) {
	return UserRoles.list()
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

exports.searchmode = function (user) {
	var index = user.roles.indexOf("search");
	if (index == -1) {
		return true
	} else {
		return false
	}
}

//Funciones extra para chequear relacion con el deal, o similares

//isPartner
//Para ver si el usuario es partner de alguno de los branches asociados a la oferta.
exports.isPartner = function (user, store) {
	var found = false;
	for (var i = store.branches.length - 1; i >= 0; i--) {
		if(store.branches[i].partner == user._id){
			return true
		}
	};
	return false
}